
const Slider = function () {
    return {
        percentageValue: new Big(0),
        unitQuantityValue: new Big(0),

        init: function ({ id }) {
            const self = this;

            const sliderContainer = document.getElementById(id);
            const thumb = sliderContainer.querySelector('.slider-thumb');
            const sliderTrack = sliderContainer.querySelector('.slider-track');
            const inputPercentage = sliderContainer.querySelector('.slider-percentage');
            const inputUnitQuantity = sliderContainer.querySelector('.slider-unit-quantity');

            let inputUnitQuantityMax = new Big(inputUnitQuantity?.max || 0); // Máximo permitido

            let isDragging = false;

            function updateThumbPosition(value, sourceInput = null, ignoreFix = false) {
                if (isNaN(Number(value))) return; // Verifica si es un número válido

                let percent = Big(Math.max(0, Math.min(100, Number(value)))); // Asegura 0-100%
                let position = percent.div(100).times(sliderTrack.clientWidth);
                thumb.style.left = position + 'px';
                
                // Mantenimiento de la posición del cursor
                let cursorPos = sourceInput ? sourceInput.selectionStart : null;

                if(ignoreFix == false){
                    inputPercentage.value = percent.toFixed(2);
                }

                self.setPercentageValue(percent);

                if (inputUnitQuantity) {
                    const unitQuantityValue = inputUnitQuantityMax.times(percent.div(100));
                    if(ignoreFix == false){
                        inputUnitQuantity.value = unitQuantityValue.toFixed(2);
                    }
                    self.setUnitQuantityValue(unitQuantityValue);
                   

                }

                document.dispatchEvent(window.sliderModified);
            }

            // Evento para mover el slider
            thumb.addEventListener('mousedown', () => { isDragging = true; });

            document.addEventListener('mousemove', (event) => {
                if (!isDragging) return;
                let rect = sliderTrack.getBoundingClientRect();
                let offsetX = event.clientX - rect.left;
                let percent = new Big(offsetX).div(rect.width).times(100);
                updateThumbPosition(percent);
            });

            document.addEventListener('mouseup', () => { isDragging = false; });

            // Evento para modificar el porcentaje manualmente
            inputPercentage.addEventListener('input', (event) => {
                let value = event.target.value.trim();
                if (!isNaN(Number(value))) {
                    updateThumbPosition(value, event.target);
                }
            });

            // **Nuevo Evento** para modificar el valor unitario manualmente
            if (inputUnitQuantity) {
                inputUnitQuantity.addEventListener('input', (event) => {
                    let value = event.target.value.trim();
                    if (!isNaN(Number(value))) {
                        let bigValue = new Big(value);
                        if (bigValue.gte(0) && bigValue.lte(inputUnitQuantityMax)) {
                            let percent = bigValue.div(inputUnitQuantityMax).times(100);
                            updateThumbPosition(percent, event.target, true);
                        }
                    }
                });
            }

            updateThumbPosition(0);
        },

        setPercentageValue: function (value) { this.percentageValue = new Big(value); },
        getPercentageValue: function () { return this.percentageValue; },
        setUnitQuantityValue: function (value) { this.unitQuantityValue = new Big(value); },
        getUnitQuantityValue: function () { return this.unitQuantityValue; },
    }
}



const ProperyPriceSlider = new Slider();
ProperyPriceSlider.init({id: 'properyPrice'});

const ContributedSavings = new Slider();
ContributedSavings.init({id: 'contributedSavings'});
