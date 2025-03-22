const Slider = function () {
    return {
        percentageValue:0,
        unitQuantityValue:0,
        init: function ({id}) {
            const self = this;



            const sliderContainer = document.getElementById(id);
            
            const thumb = sliderContainer.querySelector('.slider-thumb');
            const sliderTrack = sliderContainer.querySelector('.slider-track');
            const inputPercentage = sliderContainer.querySelector('.slider-percentage');
            const inputUnitQuantity = sliderContainer.querySelector('.slider-unit-quantity');
            let inputUnitQuantityMax = 0;
            if(!!inputUnitQuantity){
                inputUnitQuantityMax = Number(inputUnitQuantity.max)
            }

            let isDragging = false;

            function updateThumbPosition(value) {
                let percent = Math.max(0, Math.min(100, value));
                let position = (percent / 100) * sliderTrack.clientWidth;
                thumb.style.left = position + 'px';
                inputPercentage.value = percent;
                self.setPercentageValue(percent);
                if(!!inputUnitQuantity){
                    const unitQuantityValue = inputUnitQuantityMax * (percent / 100);
                    inputUnitQuantity.value = unitQuantityValue;
                    self.setUnitQuantityValue(unitQuantityValue);
                }
                document.dispatchEvent(sliderModified);

            }

            thumb.addEventListener('mousedown', () => { isDragging = true; });

            document.addEventListener('mousemove', (event) => {
                if (!isDragging) return;
                let rect = sliderTrack.getBoundingClientRect();
                let offsetX = event.clientX - rect.left;
                let percent = Math.round((offsetX / rect.width) * 100);
                updateThumbPosition(percent);
            });

            document.addEventListener('mouseup', () => {
                 isDragging = false; 
                });

            inputPercentage.addEventListener('input', (event) => {
                let value = parseInt(event.target.value, 10);
                if (!isNaN(value)) updateThumbPosition(value);
            });

            updateThumbPosition(0);
        },
        setPercentageValue: function(value){this.percentageValue = Number(value)},
        getPercentageValue: function(){return this.percentageValue},
        setUnitQuantityValue: function(value){this.unitQuantityValue = Number(value)},
        getUnitQuantityValue: function(){return this.unitQuantityValue},
    }
}


const ProperyPriceSlider = new Slider();
ProperyPriceSlider.init({id: 'properyPrice'});

const ContributedSavings = new Slider();
ContributedSavings.init({id: 'contributedSavings'});
