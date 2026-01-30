import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Desenvolvedor Freelancer",
    avatar: "",
    content: "Antes eu usava planilhas para controlar meus clientes. Agora com o DevManager, nunca mais perdi um vencimento de hospedagem.",
    rating: 5
  },
  {
    name: "Ana Oliveira",
    role: "Dona de Agência",
    avatar: "",
    content: "A gestão de projetos e tarefas me ajuda a manter toda a equipe alinhada. Recomendo demais!",
    rating: 5
  },
  {
    name: "Pedro Santos",
    role: "Web Designer",
    avatar: "",
    content: "Os lembretes automáticos são uma mão na roda. Meus clientes adoram quando eu aviso sobre renovações.",
    rating: 5
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            O que nossos usuários{" "}
            <span className="text-primary">dizem</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Desenvolvedores de todo o Brasil já estão usando o DevManager Pro.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-border/50">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
