(function(){
    const purchaseExpensesValue = Number(document.getElementById('purchase-expenses').value);
    const $propertyTotal = document.getElementById('property-total');
    const $taxesInput = document.getElementById('taxes');
    const $taxesSelect = document.getElementById('taxes-select');
    const $mortgageAmount = document.getElementById('mortgage-amount');
    const $amortizationInterestsInput = document.getElementById('amortization-interests');
    const $monthsInput = document.getElementById('months');


    function getTaxesValue() {
        const taxPercentage = new Big($taxesSelect.value || 0); // Evita NaN si el valor está vacío
        const taxValue = taxPercentage.div(100).times(ProperyPriceSlider.getUnitQuantityValue());
        return taxValue.toFixed(2); // Redondeo adecuado
    }
    
    document.addEventListener('sliderModified', (e) => {
        const taxesValue = new Big(getTaxesValue());
        $taxesInput.value = taxesValue.toFixed(2);
    
        const propertyPrice = new Big(ProperyPriceSlider.getUnitQuantityValue());
        const totalPropertyValue = propertyPrice.plus(purchaseExpensesValue).plus(taxesValue);
        $propertyTotal.value = totalPropertyValue.toFixed(2);
    
        const mortgageAmount = totalPropertyValue.minus(ContributedSavings.getUnitQuantityValue());
        $mortgageAmount.value = mortgageAmount.toFixed(2);
    });

    $taxesSelect.addEventListener('change', function(e){
        document.dispatchEvent(window.sliderModified);

    });

    $amortizationInterestsInput.addEventListener('input', function(e){
        document.dispatchEvent(window.sliderModified);

    });
    $monthsInput.addEventListener('input', function(e){
        document.dispatchEvent(window.sliderModified);

    });

})();