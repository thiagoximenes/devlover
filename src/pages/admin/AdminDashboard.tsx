import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CreditCard, TrendingUp, DollarSign, UserCheck, UserX } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  subscriptionsByPlan: { plan: string; count: number; revenue: number }[];
  totalRevenue: number;
  monthlyGrowth: { month: string; users: number; revenue: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    subscriptionsByPlan: [],
    totalRevenue: 0,
    monthlyGrowth: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      // Fetch active subscriptions
      const { data: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('id, user_id, plan_id')
        .eq('status', 'active');

      // Fetch all plans
      const { data: plans } = await supabase
        .from('plans')
        .select('id, name, price');

      // Calculate subscriptions by plan
      const subscriptionsByPlan: { plan: string; count: number; revenue: number }[] = [];
      let totalRevenue = 0;

      if (plans && activeSubscriptions) {
        plans.forEach(plan => {
          const subsForPlan = activeSubscriptions.filter(sub => sub.plan_id === plan.id);
          const count = subsForPlan.length;
          const revenue = count * parseFloat(plan.price);
          totalRevenue += revenue;

          subscriptionsByPlan.push({
            plan: plan.name,
            count,
            revenue,
          });
        });
      }

      // Mock monthly growth data (in production, this would come from aggregated data)
      const monthlyGrowth = [
        { month: 'Set', users: 45, revenue: 1350 },
        { month: 'Out', users: 67, revenue: 2010 },
        { month: 'Nov', users: 89, revenue: 2670 },
        { month: 'Dez', users: 112, revenue: 3360 },
        { month: 'Jan', users: totalUsers || 145, revenue: totalRevenue },
      ];

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeSubscriptions?.length || 0,
        inactiveUsers: (totalUsers || 0) - (activeSubscriptions?.length || 0),
        subscriptionsByPlan,
        totalRevenue,
        monthlyGrowth,
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.totalUsers,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      description: "Todos os usuários cadastrados",
    },
    {
      title: "Usuários Ativos",
      value: stats.activeUsers,
      icon: UserCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      description: "Com assinatura ativa",
    },
    {
      title: "Usuários Inativos",
      value: stats.inactiveUsers,
      icon: UserX,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      description: "Sem assinatura ativa",
    },
    {
      title: "Receita Total",
      value: `R$ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      description: "Receita estimada mensal",
    },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard Administrativo</h1>
        <p className="text-muted-foreground">
          Visão geral de métricas, usuários e receitas do sistema
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
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Crescimento de Usuários
            </CardTitle>
            <CardDescription>
              Evolução mensal de novos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.monthlyGrowth}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  name="Usuários"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              Receita Mensal
            </CardTitle>
            <CardDescription>
              Evolução da receita ao longo dos meses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `R$ ${value}`}
                />
                <Bar dataKey="revenue" fill="#10b981" name="Receita" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subscriptions by Plan - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              Assinaturas por Plano
            </CardTitle>
            <CardDescription>
              Distribuição de usuários por tipo de plano
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.subscriptionsByPlan}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ plan, count }) => `${plan}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.subscriptionsByPlan.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue by Plan - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Receita por Plano
            </CardTitle>
            <CardDescription>
              Contribuição de cada plano para a receita total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.subscriptionsByPlan} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="plan" type="category" className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => `R$ ${value}`}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" name="Receita" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
