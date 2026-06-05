Feature: Criação de pedido
  Como cliente da FeiraConecta
  Quero criar um pedido com pagamento Pix
  Para garantir minha compra com total correto e confirmação de pagamento

  Scenario: Cliente cria pedido válido
    Given existe uma cesta orgânica disponível por 35 reais
    When Ana compra 2 unidades pagando com Pix
    Then o pedido deve ser criado como pago
    And o total do pedido deve ser 70 reais
