import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, FileText, Bell, Globe, Shield } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Gestão de Clientes",
    description: "Cadastre todos os dados dos seus clientes: sites, logins, hospedagens, domínios e muito mais."
  },
  {
    icon: FolderKanban,
    title: "Projetos e Tarefas",
    description: "Organize seus projetos por cliente e gerencie tarefas com status em tempo real."
  },
  {
    icon: FileText,
    title: "Contratos",
    description: "Registre contratos com valores, prazos e status. Nunca perca um detalhe importante."
  },
  {
    icon: Bell,
    title: "Lembretes Automáticos",
    description: "Receba alertas de vencimentos de hospedagem e domínio antes que expirem."
  },
  {
    icon: Globe,
    title: "Centralização Total",
    description: "Todos os links, pastas do Drive e informações em um só lugar acessível."
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Seus dados são criptografados e protegidos. Somente você tem acesso."
  }
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tudo que você precisa em{" "}
            <span className="text-primary">um só lugar</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Funcionalidades pensadas especificamente para desenvolvedores web que 
            querem focar no que realmente importa: criar sites incríveis.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 bg-card">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
