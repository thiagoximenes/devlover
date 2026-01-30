import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Mensal",
    price: "R$ 30",
    period: "/mês",
    description: "Ideal para quem está começando",
    features: [
      "Clientes ilimitados",
      "Projetos ilimitados",
      "Gestão de contratos",
      "Alertas de vencimento",
      "Suporte por email"
    ],
    popular: false
  },
  {
    name: "Semestral",
    price: "R$ 150",
    period: "/6 meses",
    description: "Economize R$ 30 no semestre",
    features: [
      "Tudo do plano Mensal",
      "Economia de 17%",
      "Prioridade no suporte",
      "Relatórios avançados",
      "Exportação de dados"
    ],
    popular: true
  },
  {
    name: "Anual",
    price: "R$ 250",
    period: "/ano",
    description: "Maior economia do ano",
    features: [
      "Tudo do plano Semestral",
      "Economia de 31%",
      "Suporte prioritário",
      "Acesso antecipado a novidades",
      "Backup automático"
    ],
    popular: false
  }
];

export function PricingSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Planos que cabem no seu{" "}
            <span className="text-primary">bolso</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escolha o plano ideal para você. Sem taxas escondidas, sem surpresas.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border/50'}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Mais Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? "default" : "outline"}
                >
                  <Link to="/auth?mode=signup">
                    Começar Agora
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
