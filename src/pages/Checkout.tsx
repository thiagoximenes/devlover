import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Code2, CreditCard, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration_months: number;
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, refreshProfile, loading: authLoading } = useAuth();
  
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  // Simulated card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    const planId = searchParams.get('plan');
    if (!planId) {
      navigate('/select-plan');
      return;
    }

    fetchPlan(planId);
  }, [user, authLoading, searchParams, navigate]);

  const fetchPlan = async (planId: string) => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', planId)
      .single();

    if (error || !data) {
      toast.error("Plano não encontrado");
      navigate('/select-plan');
      return;
    }

    setPlan(data);
    setLoading(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !plan) return;

    // Basic validation
    if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
      toast.error("Preencha todos os campos do cartão");
      return;
    }

    setProcessing(true);

    try {
      // Calculate subscription dates
      const startsAt = new Date();
      const endsAt = new Date();
      endsAt.setMonth(endsAt.getMonth() + plan.duration_months);

      // Create subscription
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          plan_id: plan.id,
          status: 'active',
          starts_at: startsAt.toISOString(),
          ends_at: endsAt.toISOString()
        })
        .select()
        .single();

      if (subError) throw subError;

      // Create payment record
      const { error: payError } = await supabase
        .from('payments')
        .insert({
          user_id: user.id,
          subscription_id: subscription.id,
          amount: plan.price,
          status: 'paid',
          payment_method: 'credit_card',
          paid_at: new Date().toISOString()
        });

      if (payError) throw payError;

      // Refresh user profile to get updated subscription status
      await refreshProfile();

      toast.success("Pagamento realizado com sucesso!");
      navigate('/dashboard');
    } catch (error) {
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setProcessing(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background p-4">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-foreground/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto py-8 relative">
        <Link 
          to="/select-plan" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos planos
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="font-bold">DevManager Pro</span>
              </div>
              <CardTitle>Resumo do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{plan.name}</span>
                <span className="font-medium">R$ {plan.price.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">R$ {plan.price.toFixed(2)}</span>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium mb-2">O que você vai receber:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Acesso por {plan.duration_months} {plan.duration_months === 1 ? 'mês' : 'meses'}</li>
                  <li>✓ Clientes e projetos ilimitados</li>
                  <li>✓ Alertas de vencimento</li>
                  <li>✓ Suporte completo</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Dados do cartão
              </CardTitle>
              <CardDescription>
                Pagamento seguro e criptografado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número do cartão</Label>
                  <Input
                    id="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    disabled={processing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardName">Nome no cartão</Label>
                  <Input
                    id="cardName"
                    placeholder="NOME COMO NO CARTÃO"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    disabled={processing}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardExpiry">Validade</Label>
                    <Input
                      id="cardExpiry"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      maxLength={5}
                      disabled={processing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardCvc">CVC</Label>
                    <Input
                      id="cardCvc"
                      placeholder="123"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      disabled={processing}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                  <Lock className="w-4 h-4" />
                  <span>Seus dados estão protegidos</span>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={processing}
                >
                  {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Pagar R$ {plan.price.toFixed(2)}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  Ambiente de testes - Nenhum pagamento real será processado
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
