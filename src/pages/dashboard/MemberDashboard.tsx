import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, FileText, Bell, AlertTriangle, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Stats {
  totalClients: number;
  totalProjects: number;
  totalContracts: number;
  pendingNotifications: number;
}

interface UpcomingExpiry {
  id: string;
  name: string;
  type: 'hosting' | 'domain';
  expiresAt: string;
  daysLeft: number;
}

export default function MemberDashboard() {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    totalProjects: 0,
    totalContracts: 0,
    pendingNotifications: 0,
  });
  const [upcomingExpiries, setUpcomingExpiries] = useState<UpcomingExpiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
      fetchUpcomingExpiries();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    const [clientsRes, projectsRes, contractsRes, notificationsRes] = await Promise.all([
      supabase.from('clients').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('projects').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('contracts').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
    ]);

    setStats({
      totalClients: clientsRes.count || 0,
      totalProjects: projectsRes.count || 0,
      totalContracts: contractsRes.count || 0,
      pendingNotifications: notificationsRes.count || 0,
    });
  };

  const fetchUpcomingExpiries = async () => {
    if (!user) return;

    const { data: clients } = await supabase
      .from('clients')
      .select('id, name, hosting_expires_at, domain_expires_at')
      .eq('user_id', user.id);

    if (!clients) {
      setLoading(false);
      return;
    }

    const expiries: UpcomingExpiry[] = [];
    const today = new Date();

    clients.forEach(client => {
      if (client.hosting_expires_at) {
        const daysLeft = differenceInDays(new Date(client.hosting_expires_at), today);
        if (daysLeft <= 30 && daysLeft >= 0) {
          expiries.push({
            id: `${client.id}-hosting`,
            name: client.name,
            type: 'hosting',
            expiresAt: client.hosting_expires_at,
            daysLeft,
          });
        }
      }
      if (client.domain_expires_at) {
        const daysLeft = differenceInDays(new Date(client.domain_expires_at), today);
        if (daysLeft <= 30 && daysLeft >= 0) {
          expiries.push({
            id: `${client.id}-domain`,
            name: client.name,
            type: 'domain',
            expiresAt: client.domain_expires_at,
            daysLeft,
          });
        }
      }
    });

    expiries.sort((a, b) => a.daysLeft - b.daysLeft);
    setUpcomingExpiries(expiries.slice(0, 5));
    setLoading(false);
  };

  const statCards = [
    {
      title: "Clientes",
      value: stats.totalClients,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Projetos",
      value: stats.totalProjects,
      icon: FolderKanban,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Contratos",
      value: stats.totalContracts,
      icon: FileText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Notificações",
      value: stats.pendingNotifications,
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold">
          Olá, {profile?.full_name?.split(' ')[0] || 'Usuário'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle. Aqui está um resumo das suas atividades.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upcoming Expiries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Próximos Vencimentos
          </CardTitle>
          <CardDescription>
            Hospedagens e domínios que vencem nos próximos 30 dias
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingExpiries.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum vencimento nos próximos 30 dias</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingExpiries.map((expiry) => (
                <div
                  key={expiry.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      expiry.daysLeft <= 7 ? 'bg-destructive/10' : 'bg-orange-500/10'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        expiry.daysLeft <= 7 ? 'text-destructive' : 'text-orange-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{expiry.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {expiry.type === 'hosting' ? 'Hospedagem' : 'Domínio'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      expiry.daysLeft <= 7 ? 'text-destructive' : 'text-orange-500'
                    }`}>
                      {expiry.daysLeft === 0 ? 'Vence hoje!' : `${expiry.daysLeft} dias`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(expiry.expiresAt), "dd/MM/yyyy", { locale: ptBR })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
