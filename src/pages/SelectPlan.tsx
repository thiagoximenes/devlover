import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2, Code2 } from "lucide-react";
import { toast } from "sonner";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  duration_months: number;
}

const planFeatures: Record<string, string[]> = {
  monthly: [
    "Clientes ilimitados",
    "Projetos ilimitados",
    "Gestão de contratos",
    "Alertas de vencimento",
    "Suporte por email"
  ],
  semiannual: [
    "Tudo do plano Mensal",
    "Economia de 17%",
    "Prioridade no suporte",
    "Relatórios avançados",
    "Exportação de dados"
  ],
  annual: [
    "Tudo do plano Semestral",
    "Economia de 31%",
    "Suporte prioritário",
    "Acesso antecipado a novidades",
    "Backup automático"
  ]
};

export default function SelectPlan() {
  const navigate = useNavigate();
  const { user, hasActiveSubscription, loading: authLoading, refreshProfile } = useAuth();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (!authLoading && hasActiveSubscription) {
      navigate('/dashboard');
      return;
    }

    fetchPlans();
  }, [user, authLoading, hasActiveSubscription, navigate]);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) {
      toast.error("Erro ao carregar planos");
    } else {
      setPlans(data || []);
    }
    setLoading(false);
  };

  const handleSelectPlan = async (plan: Plan) => {
    if (!user) return;
    
    setProcessingPlan(plan.id);
    
    // Navigate to checkout with plan info
    navigate(`/checkout?plan=${plan.id}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/30 to-background p-4">
      <div className="absolute top-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-foreground/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto py-12 relative">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
              <Code2 className="w-7 h-7 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Escolha seu plano
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selecione o plano ideal para você e comece a gerenciar seus clientes hoje mesmo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const isPopular = plan.type === 'semiannual';
            const features = planFeatures[plan.type] || [];
            
            return (
              <Card 
                key={plan.id} 
                className={`relative ${isPopular ? 'border-primary shadow-lg scale-105' : 'border-border/50'}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.duration_months === 1 ? '1 mês' : `${plan.duration_months} meses`}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">R$ {plan.price.toFixed(0)}</span>
                    <span className="text-muted-foreground">
                      /{plan.duration_months === 1 ? 'mês' : plan.duration_months === 6 ? '6 meses' : 'ano'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2">
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={isPopular ? "default" : "outline"}
                    onClick={() => handleSelectPlan(plan)}
                    disabled={processingPlan === plan.id}
                  >
                    {processingPlan === plan.id && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Selecionar
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
