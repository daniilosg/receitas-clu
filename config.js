/*
 * CONFIGURAÇÃO CENTRAL — COZINHA COM A LU
 * Edite somente este arquivo para gerenciar oferta, planos e checkout.
 */
window.CozinhaComLuConfig = {
  // VISIBILIDADE
  // true = mostrar | false = ocultar
  mostrarBonus: false, // .bonus-bridge + .bonuses
  mostrarPlanoCompleto: false, // .alerta-up + .plano-recomendado-wrap

  // PLANOS, PREÇOS E LINKS DE PAGAMENTO
  planos: {
    basico: {
      precoAntes: '€49,90',
      preco: '€9,90',
      linkPagamento: 'https://pay.hotmart.com/C107687635H?off=ihndelia'
    },

    completo: {
      precoAntes: '€169,90',
      preco: '€37,90',
      linkPagamento: 'https://pay.hotmart.com/V103624520G?checkoutMode=10'
    }
  }
};
