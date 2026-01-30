import { Code2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent-foreground flex items-center justify-center">
                <Code2 className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">DevManager Pro</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              O sistema completo para desenvolvedores web gerenciarem seus clientes, 
              projetos e muito mais. Organize-se e nunca perca um prazo.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="/#features" className="hover:text-foreground transition-colors">Funcionalidades</Link></li>
              <li><Link to="/#pricing" className="hover:text-foreground transition-colors">Preços</Link></li>
              <li><Link to="/auth?mode=signup" className="hover:text-foreground transition-colors">Cadastro</Link></li>
              <li><Link to="/auth" className="hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link to="#" className="hover:text-foreground transition-colors">Termos de Uso</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Privacidade</Link></li>
              <li><Link to="#" className="hover:text-foreground transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} DevManager Pro. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
