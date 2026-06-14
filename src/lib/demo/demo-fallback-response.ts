export function buildDemoFallbackResponse(customerMessage: string) {
  const message = customerMessage.trim();

  return `Ola! Sobre: ${message}. Para te responder certinho, me envie mais detalhes ou confirme sua regiao. Assim consigo te orientar melhor sem te passar informacao errada.`;
}
