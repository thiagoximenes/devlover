import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Search, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Client {
  id: string;
  name: string;
}

interface Contract {
  id: string;
  title: string;
  value: number;
  status: string;
  starts_at: string | null;
  ends_at: string | null;
  notes: string | null;
  client_id: string;
  created_at: string;
  clients: { name: string } | null;
}

export default function ContractsPage() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    value: "",
    status: "draft",
    starts_at: "",
    ends_at: "",
    notes: "",
    client_id: "",
  });

  useEffect(() => {
    if (user) {
      fetchClients();
      fetchContracts();
    }
  }, [user]);

  const fetchClients = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("clients")
      .select("id, name")
      .eq("user_id", user.id)
      .order("name");
    setClients(data || []);
  };

  const fetchContracts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("contracts")
      .select("*, clients(name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar contratos");
    } else {
      setContracts(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      value: "",
      status: "draft",
      starts_at: "",
      ends_at: "",
      notes: "",
      client_id: "",
    });
    setEditingContract(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (contract: Contract) => {
    setEditingContract(contract);
    setFormData({
      title: contract.title,
      value: contract.value.toString(),
      status: contract.status,
      starts_at: contract.starts_at || "",
      ends_at: contract.ends_at || "",
      notes: contract.notes || "",
      client_id: contract.client_id,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.client_id) return;

    setSaving(true);

    const contractData = {
      user_id: user.id,
      title: formData.title,
      value: parseFloat(formData.value) || 0,
      status: formData.status as "draft" | "active" | "completed" | "cancelled",
      starts_at: formData.starts_at || null,
      ends_at: formData.ends_at || null,
      notes: formData.notes || null,
      client_id: formData.client_id,
    };

    try {
      if (editingContract) {
        const { error } = await supabase
          .from("contracts")
          .update(contractData)
          .eq("id", editingContract.id);

        if (error) throw error;
        toast.success("Contrato atualizado!");
      } else {
        const { error } = await supabase.from("contracts").insert(contractData);
        if (error) throw error;
        toast.success("Contrato criado!");
      }

      setDialogOpen(false);
      resetForm();
      fetchContracts();
    } catch (error) {
      toast.error("Erro ao salvar contrato");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este contrato?")) return;

    const { error } = await supabase.from("contracts").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir contrato");
    } else {
      toast.success("Contrato excluído!");
      fetchContracts();
    }
  };

  const filteredContracts = contracts.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.clients?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "outline",
      active: "default",
      completed: "secondary",
      cancelled: "destructive",
    };
    const labels: Record<string, string> = {
      draft: "Rascunho",
      active: "Ativo",
      completed: "Concluído",
      cancelled: "Cancelado",
    };
    return <Badge variant={variants[status] || "secondary"}>{labels[status] || status}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

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
          <h1 className="text-2xl font-bold">Contratos</h1>
          <p className="text-muted-foreground">Gerencie seus contratos com clientes</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Contrato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingContract ? "Editar Contrato" : "Novo Contrato"}
              </DialogTitle>
              <DialogDescription>Preencha os dados do contrato</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select
                  value={formData.client_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, client_id: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="value">Valor (R$) *</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) =>
                      setFormData({ ...formData, value: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="completed">Concluído</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="starts_at">Data Início</Label>
                  <Input
                    id="starts_at"
                    type="date"
                    value={formData.starts_at}
                    onChange={(e) =>
                      setFormData({ ...formData, starts_at: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ends_at">Data Fim</Label>
                  <Input
                    id="ends_at"
                    type="date"
                    value={formData.ends_at}
                    onChange={(e) =>
                      setFormData({ ...formData, ends_at: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
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
                  {editingContract ? "Salvar" : "Criar"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar contratos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contrato</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Período</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContracts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {searchTerm
                        ? "Nenhum contrato encontrado"
                        : "Nenhum contrato cadastrado"}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredContracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{contract.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>{contract.clients?.name || "-"}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(contract.value)}
                    </TableCell>
                    <TableCell>{getStatusBadge(contract.status)}</TableCell>
                    <TableCell>
                      {contract.starts_at && contract.ends_at
                        ? `${format(new Date(contract.starts_at), "dd/MM/yy", {
                            locale: ptBR,
                          })} - ${format(new Date(contract.ends_at), "dd/MM/yy", {
                            locale: ptBR,
                          })}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(contract)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(contract.id)}
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
