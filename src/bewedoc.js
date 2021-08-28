class Bewedoc {
    
    constructor(config){
        this.transform = 0;
        this.slider = document.querySelector(config.el)
        this.config = config
        this.getChangeElement()
        this.items = document.querySelectorAll('.bewedoc__children');
        this.sliderContainer = document.querySelector('.bewedoc__items');
        this.prev = document.querySelector('.bewedoc__arrow-prev');
        this.next = document.querySelector('.bewedoc__arrow-next');
    }

    getChangeElement = () => {
        const sliderItems = document.createElement('div');
        sliderItems.classList.add('bewedoc__items');
        const children =  this.getChildrens();
        sliderItems.append(...children);
        this.slider.innerHTML = '';
        this.slider.append(sliderItems)
        const arrow = this.createArrow();
        const dots = this.createDots(children)
        this.slider.classList.add('bewedoc');
        arrow?  this.slider.innerHTML += arrow: null;
        dots?  this.slider.append(dots): null;
        this.prevClick(children)
        this.nextClick(children)

    }

    getChildrens = () => {
        const childrens = [...this.slider.children];
        childrens.forEach((children, i) => {
            children.classList.add('bewedoc__children')
            children.setAttribute('data-count', i)
        })
        return childrens;
    }

    createArrow = () => {
        if (!this.config.arrow) return
        const html = `
        <div class="bewedoc__arrow">
            <button class="bewedoc__arrow-prev"></button>
            <button class="bewedoc__arrow-next"></button>
        </div>   
        `;
        return html;
            
    }
    createDots = (children) => {
        if (!this.config.dots) return
        const dots = document.createElement('ul');
        dots.classList.add('bewedoc__dots');
        
        children.forEach((item, i) => {
            const li = document.createElement('li');
            li.classList.add('bewedoc_dot')
            i === 0 ? li.classList.add('active-dot'):''
            li.classList.add(`dot-count-${i}`)
            li.setAttribute('data-dot-count', i)
            li.addEventListener('click', this.changeDotClick);
            dots.append(li)
        })
        return dots
        
            
    }

    changeSlider = (elements,to) => {
        this.sliderContainer.innerHTML = '';
        this.sliderContainer.append(...elements)
        this.sliderContainerStyle()
        if (to === 'next') {
            this.sliderContainer.classList.add('next')
        }
        if (to === 'prev') {
            this.sliderContainer.classList.add('prev')
        }
        if (this.config.dots) {
            this.addRomoveDothActiveClass(this.sliderContainer.children[0].dataset.count)
        }
       
        setTimeout(() => {
            this.sliderContainer.classList.remove('next');
            this.sliderContainer.classList.remove('prev')
            this.prev.disabled = false;
            this.next.disabled = false;
        },300)
        
    }

    sliderContainerStyle() {
        this.sliderContainer.style = 
            ` animation-duration: ${this.config.animation.speed}s;
              animation-timing-function: ${this.config.animation.type};
            `
    }
    
    addRomoveDothActiveClass = (count) => {
        const dots = document.querySelectorAll('.bewedoc_dot');
        dots.forEach(dot => {
            +dot.dataset.dotCount === +count?
            dot.classList.add('active-dot'):
            dot.classList.remove('active-dot');
        })
    }
    
    changeDotClick = (e) => {
        
        const activeCount = +e.target.dataset.dotCount;
        let tmpItems = [...this.items];
        this.sliderContainer.innerHTML = ''
        this.sliderContainer.append(...tmpItems);
        this.transform = activeCount;
        this.transformSlider(activeCount)
        this.addRomoveDothActiveClass(activeCount)
        let findId = tmpItems.findIndex(item => +item.dataset.count === activeCount)
        let spliceArray = tmpItems.splice(findId, tmpItems.length - 1);
        tmpItems = [...spliceArray, ...tmpItems]
        this.nextClick(tmpItems);
        this.prevClick(tmpItems)
       
    }
    transformSlider = (size = false) => {
        if (size) {
            this.sliderContainer.style = `transform: translateX(-${100 * size}%); transition: transform ${this.config.animation.speed}s;`
        }else{
            
           this.sliderContainer.style = `transform: translateX(0);  transition: transform ${this.config.animation.speed}s;`  
        }   
    }
    prevClick = (children) => {
        const prev = document.querySelector('.bewedoc__arrow-prev')
        prev.addEventListener('click',e => {
            this.transformSlider()
            let first = children.pop()
            children.unshift(first);
            this.changeSlider(children, 'prev');
            this.prev.disabled = true;
            this.next.disabled = true;
        })
    }
   
    nextClick = (children) => {        
        const next = document.querySelector('.bewedoc__arrow-next')
        
        next.addEventListener('click',e => {  
            this.transformSlider()
            let first = children.shift()
            children.push(first);
            this.changeSlider(children, 'next');
            this.prev.disabled = true;
            this.next.disabled = true;
              
        })
    }

    
}




// console.log(Bewedoc);
// new Bewedoc({
//     el: '.my-slider',
//     arrow: true,
//     dots: true,
//     animation: {
//         type: 'linear',
//         speed: 0.3
//     }
    
// })