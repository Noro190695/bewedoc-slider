export class Bewedoc {
    
    constructor(config){
        this.transform = 0;
        this.slider = document.querySelector(config.el)
        this.config = config
        this.getChangeElement()
        this.items = document.querySelectorAll('.bewedoc__children');
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
        dots?  this.slider.append(dots): null
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
        const  sliderItems = document.querySelector('.bewedoc__items');
        
        sliderItems.innerHTML = '';
        sliderItems.append(...elements)
        if (to === 'next') {
            sliderItems.classList.add('next')
        }
        if (to === 'prev') {
            sliderItems.classList.add('prev')
        }
        if (this.config.dots) {
            this.addRomoveDothActiveClass(sliderItems.children[0].dataset.count)
        }
       
        setTimeout(() => {
            sliderItems.classList.remove('next');
            sliderItems.classList.remove('prev')
            this.prev.disabled = false;
            this.next.disabled = false;
        },300)
        
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
        const slider = document.querySelector('.bewedoc__items');
        let tmpItems = [...this.items];
        slider.innerHTML = ''
        slider.append(...this.items);
        this.transform = activeCount;
        slider.style = `transform: translateX(-${100 * this.transform}%)`
        this.addRomoveDothActiveClass(activeCount)
        tmpItems.forEach((item, i) => {
            if (+item.dataset.count === activeCount) {
                let j = tmpItems.splice(i, 1)
                
                tmpItems.unshift(...j)
                
            }
            
        })
        this.nextClick(tmpItems)
        this.prevClick(tmpItems)
        
        
        
    }
    prevClick = (children) => {
        const prev = document.querySelector('.bewedoc__arrow-prev')
        prev.addEventListener('click',e => {
            let first = children.pop()
            children.unshift(first);
            this.changeSlider(children, 'prev');
            this.prev.disabled = true;
            this.next.disabled = true;
        })
    }

    nextClick = (children) => {
        children = [...children]
       
        const next = document.querySelector('.bewedoc__arrow-next')
        next.addEventListener('click',e => {
            console.log(...children);
            let first = children.shift()
            children.push(first);
            this.changeSlider(children, 'next');
            this.prev.disabled = true;
            this.next.disabled = true;
            console.log(...children);
              
        })
    }

    
}

new Bewedoc({
    el: '.slider',
    arrow: true,
    dots: true
})

