/*
 * CONFIGURAÇÃO CENTRAL — COZINHA COM A LU
 * Edite somente este arquivo para gerenciar oferta, planos e checkout.
 */
window.CozinhaComLuConfig = {
  // VISIBILIDADE
  // true = mostrar | false = ocultar
  mostrarBonus: false, // .bonus-bridge + .bonuses
  mostrarPlanoCompleto: true, // .alerta-up + .plano-recomendado-wrap

  // PLANOS, PREÇOS E LINKS DE PAGAMENTO
  planos: {
    basico: {
      precoAntes: '€29,90',
      preco: '€7,90',
      linkPagamento: 'https://pay.hotmart.com/C107687635H?off=zifhv669'
    },

    completo: {
      precoAntes: '€49,90',
      preco: '€12,90',
      linkPagamento: 'https://pay.hotmart.com/C107687635H?off=ihndelia'
    }
  }
};
