function calculateItemizedFees(P, anualRate, n) {
    const r = new Big(anualRate).div(12).div(100); // Tasa de interés mensual
    const bigP = new Big(P);
    
    // Cuota mensual fija
    const monthlyFee = bigP.times(r).div(new Big(1).minus((new Big(1).plus(r)).pow(-n)));
    
    let outstandingBalance = bigP;
    let payments = [];

    for (let month = 1; month <= n; month++) {
        const interests = outstandingBalance.times(r); // Intereses del mes
        const amortized = monthlyFee.minus(interests); // Parte del pago que reduce el capital
        outstandingBalance = outstandingBalance.minus(amortized); // Saldo pendiente de pago

        // Plazo en días (30 días por mes)
        const deadlineDays = month * 30;

        // Agregar información mensual a la lista
        payments.push({
            paymentIndex: month,
            initialBalance: roundBig(outstandingBalance.plus(amortized)), // Saldo antes de pagar
            capitalPayment: roundBig(amortized),
            interests: roundBig(interests),
            paymentAmount: roundBig(monthlyFee),
            days: deadlineDays,
            finalBalance: roundBig(outstandingBalance)
        });
    }

    return payments;
}


function createRow({ index, balance, capitalPayment, interests, paymentAmount, days, remaningBalance }) {
    return `
    <div class="table-row">
        <div class="table-data payment-number-col">
            <p>${index}</p>
        </div>
        <div class="table-data">
            <p>${balance}</p>
        </div>
        <div class="table-data">
            <p>${capitalPayment}</p>
        </div>
        <div class="table-data">
            <p>${interests}</p>
        </div>
        <div class="table-data">
            <p>${paymentAmount}</p>
        </div>
        <div class="table-data">
            <p>${days}</p>
        </div>
        <div class="table-data">
            <p>${remaningBalance}</p>
        </div>
    </div>
    `;

}



// Función de redondeo con precisión adecuada
function roundBig(value) {
    return value.round(2).toFixed(2);
}

function updateTable() {
    const $amortizationTableBody = document.getElementById("amortization-table-body");
    $amortizationTableBody.innerHTML = '';

    const loanAmount = document.getElementById('mortgage-amount').value;
    const annualInterestRate = document.getElementById('amortization-interests').value;
    const paymentsQuantity = document.getElementById('months').value;

    const paymentsList = calculateItemizedFees(loanAmount, annualInterestRate, paymentsQuantity);

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

document.addEventListener('sliderModified', function (e) {
    updateTable();
});