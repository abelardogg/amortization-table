function calculateItemizedFees(P, anualRate, n) {
    const r = anualRate / 12 / 100; // Tasa de interes mensual
    const monthlyFee = (P * r) / (1 - Math.pow(1 + r, -n)); // Cuota mensual fija
    let outstandingBalance = P;  // Monto inicial del prestamo
    let payments = [];  // Array información mensual

    for (let month = 1; month <= n; month++) {
        // Calcular los intereses del mes
        const interests = outstandingBalance * r;

        // Calcular el amortizado (parte del pago que va a reducir el principal)
        const amortized = monthlyFee - interests;

        // Calcular el saldo pendiente de pago
        outstandingBalance -= amortized;

        // Plazo en días (suponiendo que se paga mensual, 30 días por mes)
        const deadlineDays = month * 30;

        // Agregar la información del mes a la lista
        payments.push({
            paymentIndex: month,
            initialBalance: window.roundNumber(outstandingBalance + amortized), // El saldo antes de realizar el pago
            capitalPayment: window.roundNumber(amortized),
            interests: window.roundNumber(interests),
            paymentAmount: window.roundNumber(monthlyFee),
            days: deadlineDays,
            finalBalance: window.roundNumber(outstandingBalance)
        });
    }

    return payments;
}


function createRow({ index, balance, capitalPayment, interests, paymentAmount, days, remaningBalance }) {
    return `
    <div style="display: flex;">
        <div style="width: 120px;">
            <p>${index}</p>
        </div>
        <div style="width: 120px;">
            <p>${balance}</p>
        </div>
        <div style="width: 120px;">
            <p>${capitalPayment}</p>
        </div>
        <div style="width: 120px;">
            <p>${interests}</p>
        </div>
        <div style="width: 120px;">
            <p>${paymentAmount}</p>
        </div>
        <div style="width: 120px;">
            <p>${days}</p>
        </div>
        <div style="width: 120px;">
            <p>${remaningBalance}</p>
        </div>
    </div>
    `;

}


function updateTable() {

    const $amortizationTableBody = document.getElementById("amortization-table-body");

    $amortizationTableBody.innerHTML = '';

    // Ejemplo de uso:
    const loanAmount = document.getElementById('mortgage-amount').value;  // Monto del prestamo
    const annualInterestRate = document.getElementById('amortization-interests').value;  // Tasa de interes anual en porcentaje
    const paymentsQuantity = document.getElementById('months').value;  // Numero total de pagos (por ejemplo, 24 meses)

    const paymentsList = calculateItemizedFees(loanAmount, annualInterestRate, paymentsQuantity);

    // Iterar la información mensual
    paymentsList.forEach(payment => {

        const $el = createRow({
            index: payment.paymentIndex,
            balance: payment.initialBalance,
            capitalPayment: payment.capitalPayment,
            interests: payment.interests,
            paymentAmount: payment.paymentAmount,
            days: payment.days,
            remaningBalance: payment.finalBalance
        });
        $amortizationTableBody.insertAdjacentHTML("beforeend", $el);
    });
}
document.addEventListener('sliderModified', function(e){
    updateTable();

});

