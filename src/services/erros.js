export function mensagemDeErro(err, padrao) {
  const detalhe = err.response?.data?.detail
  return typeof detalhe === "string" ? detalhe : padrao
}