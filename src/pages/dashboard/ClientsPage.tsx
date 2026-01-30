import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Loader2, Globe, Server, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Client {
  id: string;
  name: string;
  email: string | null;
  site: string | null;
  site_login: string | null;
  site_password: string | null;
  hosting: string | null;
  hosting_expires_at: string | null;
  domain_registrar: string | null;
  domain_expires_at: string | null;
  drive_folder: string | null;
  links: string[] | null;
  notes: string | null;
  created_at: string;
}

export default function ClientsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    site: "",
    site_login: "",
    site_password: "",
    hosting: "",
    hosting_expires_at: "",
    domain_registrar: "",
    domain_expires_at: "",
    drive_folder: "",
    links: "",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      fetchClients();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar clientes");
    } else {
      setClients(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      site: "",
      site_login: "",
      site_password: "",
      hosting: "",
      hosting_expires_at: "",
      domain_registrar: "",
      domain_expires_at: "",
      drive_folder: "",
      links: "",
      notes: "",
    });
    setEditingClient(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || "",
      site: client.site || "",
      site_login: client.site_login || "",
      site_password: client.site_password || "",
      hosting: client.hosting || "",
      hosting_expires_at: client.hosting_expires_at || "",
      domain_registrar: client.domain_registrar || "",
      domain_expires_at: client.domain_expires_at || "",
      drive_folder: client.drive_folder || "",
      links: client.links?.join(", ") || "",
      notes: client.notes || "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);

    const clientData = {
      user_id: user.id,
      name: formData.name,
      email: formData.email || null,
      site: formData.site || null,
      site_login: formData.site_login || null,
      site_password: formData.site_password || null,
      hosting: formData.hosting || null,
      hosting_expires_at: formData.hosting_expires_at || null,
      domain_registrar: formData.domain_registrar || null,
      domain_expires_at: formData.domain_expires_at || null,
      drive_folder: formData.drive_folder || null,
      links: formData.links ? formData.links.split(",").map((l) => l.trim()) : null,
      notes: formData.notes || null,
    };

    try {
      if (editingClient) {
        const { error } = await supabase
          .from("clients")
          .update(clientData)
          .eq("id", editingClient.id);

        if (error) throw error;
        toast.success("Cliente atualizado com sucesso!");
      } else {
        const { error } = await supabase.from("clients").insert(clientData);

        if (error) throw error;
        toast.success("Cliente criado com sucesso!");
      }

      setDialogOpen(false);
      resetForm();
      fetchClients();
    } catch (error) {
      toast.error("Erro ao salvar cliente");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente?")) return;

    const { error } = await supabase.from("clients").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir cliente");
    } else {
      toast.success("Cliente excluído com sucesso!");
      fetchClients();
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.site?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie todos os seus clientes em um só lugar
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Cliente" : "Novo Cliente"}
              </DialogTitle>
              <DialogDescription>
                Preencha os dados do cliente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="site">Site</Label>
                <Input
                  id="site"
                  value={formData.site}
                  onChange={(e) =>
                    setFormData({ ...formData, site: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_login">Login do Site</Label>
                  <Input
                    id="site_login"
                    value={formData.site_login}
                    onChange={(e) =>
                      setFormData({ ...formData, site_login: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_password">Senha do Site</Label>
                  <Input
                    id="site_password"
                    type="password"
                    value={formData.site_password}
                    onChange={(e) =>
                      setFormData({ ...formData, site_password: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hosting">Hospedagem</Label>
                  <Input
                    id="hosting"
                    value={formData.hosting}
                    onChange={(e) =>
                      setFormData({ ...formData, hosting: e.target.value })
                    }
                    placeholder="Nome do provedor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hosting_expires_at">Vencimento Hospedagem</Label>
                  <Input
                    id="hosting_expires_at"
                    type="date"
                    value={formData.hosting_expires_at}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hosting_expires_at: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain_registrar">Registrador do Domínio</Label>
                  <Input
                    id="domain_registrar"
                    value={formData.domain_registrar}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        domain_registrar: e.target.value,
                      })
                    }
                    placeholder="Registro.br, GoDaddy, etc"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain_expires_at">Vencimento Domínio</Label>
                  <Input
                    id="domain_expires_at"
                    type="date"
                    value={formData.domain_expires_at}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        domain_expires_at: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drive_folder">Pasta do Drive</Label>
                <Input
                  id="drive_folder"
                  value={formData.drive_folder}
                  onChange={(e) =>
                    setFormData({ ...formData, drive_folder: e.target.value })
                  }
                  placeholder="Link da pasta"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="links">Links (separados por vírgula)</Label>
                <Input
                  id="links"
                  value={formData.links}
                  onChange={(e) =>
                    setFormData({ ...formData, links: e.target.value })
                  }
                  placeholder="https://..., https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingClient ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Clients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Hospedagem</TableHead>
                <TableHead>Domínio</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "Nenhum cliente encontrado"
                        : "Nenhum cliente cadastrado ainda"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        {client.email && (
                          <p className="text-sm text-muted-foreground">
                            {client.email}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.site ? (
                        <a
                          href={client.site}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline"
                        >
                          <Globe className="h-4 w-4" />
                          Ver site
                        </a>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.hosting_expires_at ? (
                        <Badge
                          variant={
                            new Date(client.hosting_expires_at) < new Date()
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          <Server className="h-3 w-3 mr-1" />
                          {format(
                            new Date(client.hosting_expires_at),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {client.domain_expires_at ? (
                        <Badge
                          variant={
                            new Date(client.domain_expires_at) < new Date()
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          {format(
                            new Date(client.domain_expires_at),
                            "dd/MM/yyyy",
                            { locale: ptBR }
                          )}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(client)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(client.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
