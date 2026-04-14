import { Shield, Clock, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Shield,
    title: "Pagamento protegido",
    description: "Seu dinheiro fica retido até você confirmar o recebimento do ingresso.",
  },
  {
    icon: Clock,
    title: "Vendedor tem 24h",
    description: "Após o pagamento, o vendedor tem 24h para enviar o ingresso.",
  },
  {
    icon: CheckCircle,
    title: "Confirme e pronto",
    description: "Confirme o recebimento e o pagamento é liberado para o vendedor.",
  },
];

export default function SafetyBanner() {
  return (
    <div className="glass-card p-6 border border-[rgba(224,248,9,0.15)]">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-[#e0f809]" />
        <h3
          className="font-semibold text-white text-sm"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Compra 100% protegida
        </h3>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-main flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px h-4 bg-white/20 mt-1" />
                )}
              </div>
              <div className="pb-1">
                <p
                  className="text-white text-sm font-medium"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  {step.title}
                </p>
                <p className="text-white/50 text-xs mt-0.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
