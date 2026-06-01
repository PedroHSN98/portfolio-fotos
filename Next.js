import { SpeedInsights } from "@vercel/speed-insights/next"

export default function ComponenteLogado() {
  return (
    <div>
      {/* O restante do seu código existente entra aqui */}
      
      {/* Insira a tag do Vercel Speed Insights logo antes de fechar a div principal */}
      <SpeedInsights />
    </div>
  )
}