(function(){
    const purchaseExpensesValue = Number(document.getElementById('purchase-expenses').value);
    const $propertyTotal = document.getElementById('property-total');
    const $taxesInput = document.getElementById('taxes');
    const $taxesSelect = document.getElementById('taxes-select');
    const $mortgageAmount = document.getElementById('mortgage-amount');
    const $amortizationInterestsInput = document.getElementById('amortization-interests');
    const $monthsInput = document.getElementById('months');


    function getTaxesValue(){
        const taxPercentage = Number($taxesSelect.value);
        const taxValue = window.roundNumber(Number(taxPercentage) / 100) * ProperyPriceSlider.getUnitQuantityValue();
        return window.roundNumber(taxValue);
    }

    document.addEventListener('sliderModified', (e) => {
        const taxesValue = getTaxesValue();
        $taxesInput.value = taxesValue
        
        $propertyTotal.value = ProperyPriceSlider.getUnitQuantityValue() + purchaseExpensesValue + taxesValue;
        $mortgageAmount.value = $propertyTotal.value - ContributedSavings.getUnitQuantityValue();

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