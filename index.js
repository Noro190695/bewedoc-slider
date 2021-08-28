export class Bewedoc {
    
    constructor(config){
        this.transform = 0;
        this.slider = document.querySelector(config.el)
        this.config = config
        this.getChangeElement()
        this.items = this.slider.querySelectorAll('.bewedoc__children');
        this.sliderContainer = this.slider.querySelector('.bewedoc__items');
        this.prev = this.slider.querySelector('.bewedoc__arrow-prev');
        this.next = this.slider.querySelector('.bewedoc__arrow-next');
        
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
        if (arrow) {
            this.slider.innerHTML += arrow;
            this.prevClick(children)
            this.nextClick(children)
        }
        if (dots) {
            this.slider.append(dots)
        }
        if (this.config.autoPlay) {
            this.autoPlay(children)
        }
        

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
            ` animation-duration: ${this.config.animation?this.config.animation.speed:.3}s;
              animation-timing-function: ${this.config.animation ? this.config.animation.type : 'linear'};
            `
    }
    
    addRomoveDothActiveClass = (count) => {
        const dots = this.slider.querySelectorAll('.bewedoc_dot');
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
        if (this.config.arrow) {
            this.nextClick(tmpItems);
            this.prevClick(tmpItems);
        }
        if (this.config.autoPlay) {
            this.autoPlay(tmpItems)
        }
       
    }
    transformSlider = (size = false) => {
        if (size) {
            this.sliderContainer.style = `transform: translateX(-${100 * size}%); transition: transform ${this.config.animation?this.config.animation.speed:.3}s;`
        }else{
            
           this.sliderContainer.style = `transform: translateX(0);  transition: transform ${this.config.animation?this.config.animation.speed:.3}s;`  
        }   
    }
    prevClick = (children) => {
        const prev = this.slider.querySelector('.bewedoc__arrow-prev');
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
        const next = this.slider.querySelector('.bewedoc__arrow-next')
        
        next.addEventListener('click',e => {  
            this.transformSlider()
            let first = children.shift()
            children.push(first);
            this.changeSlider(children, 'next');
            this.prev.disabled = true;
            this.next.disabled = true;
              
        })
    }
    autoPlay = (children) => {
       const interval =  setInterval(() => {
            this.transformSlider()
            let first = children.shift()
            children.push(first);
            this.changeSlider(children, 'next');
            this.prev.disabled = true;
            this.next.disabled = true;
        },this.config.delay? this.config.delay: 3000)

       
    }

    
}
class Style {
    static add = () => {
        let style = document.createElement('style');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css')

        style.innerHTML = `.bewedoc {
            width: 100%;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            position: relative;
            overflow: hidden;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
          }
          
          .bewedoc__items {
            width: 100%;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-transition: -webkit-transform .3s;
            transition: -webkit-transform .3s;
            transition: transform .3s;
            transition: transform .3s, -webkit-transform .3s;
          }
          
          .bewedoc__children {
            max-width: 100%;
            min-width: 100%;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
          }
          
          .bewedoc__children img {
            width: 100%;
            -o-object-fit: contain;
               object-fit: contain;
          }
          
          .bewedoc__arrow {
            width: 100%;
            height: 0;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: justify;
                -ms-flex-pack: justify;
                    justify-content: space-between;
            position: absolute;
            top: 50%;
            -webkit-transform: translateY(-50%);
                    transform: translateY(-50%);
          }
          
          .bewedoc__arrow button {
            width: 30px;
            height: 30px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            position: relative;
            background: rgba(0, 0, 0, 0.1);
            border: none;
            cursor: pointer;
            margin-top: -15px;
            -webkit-transition: .3s;
            transition: .3s;
            border-radius: 3px;
            background-image: url("https://cdn4.iconfinder.com/data/icons/evil-icons-user-interface/64/arrow_right2-128.png");
            background-size: cover;
          }
          
          .bewedoc__arrow button:hover {
            background-color: rgba(0, 0, 0, 0.3);
          }
          
          .bewedoc__arrow-prev {
            margin-left: 10px;
            -webkit-transform: rotate(180deg);
                    transform: rotate(180deg);
          }
          
          .bewedoc__arrow-next {
            margin-right: 10px;
          }
          
          .bewedoc__dots {
            position: absolute;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            list-style: none;
            padding: 0;
            margin: 0;
            bottom: 10px;
            left: 50%;
            -webkit-transform: translateX(-50%);
                    transform: translateX(-50%);
          }
          
          .bewedoc__dots li {
            width: 10px;
            height: 10px;
            background: rgba(0, 0, 0, 0.2);
            margin: 0px 5px;
            border-radius: 50%;
            cursor: pointer;
          }
          
          .bewedoc__dots .active-dot {
            background: rgba(0, 0, 0, 0.7);
          }
          
          .prev {
            -webkit-animation: prev .3s linear;
                    animation: prev .3s linear;
          }
          
          .next {
            -webkit-animation: next .3s linear;
                    animation: next .3s linear;
          }
          
          @-webkit-keyframes prev {
            from {
              -webkit-transform: translateX(-100%);
                      transform: translateX(-100%);
            }
            to {
              -webkit-transform: translateX(0%);
                      transform: translateX(0%);
            }
          }
          
          @keyframes prev {
            from {
              -webkit-transform: translateX(-100%);
                      transform: translateX(-100%);
            }
            to {
              -webkit-transform: translateX(0%);
                      transform: translateX(0%);
            }
          }
          
          @-webkit-keyframes next {
            from {
              -webkit-transform: translateX(100%);
                      transform: translateX(100%);
            }
            to {
              -webkit-transform: translateX(0%);
                      transform: translateX(0%);
            }
          }
          
          @keyframes next {
            from {
              -webkit-transform: translateX(100%);
                      transform: translateX(100%);
            }
            to {
              -webkit-transform: translateX(0%);
                      transform: translateX(0%);
            }
          }
          /*# sourceMappingURL=bewedoc.css.map */`
          return style
    }
}
document.head.append(Style.add())

// new Bewedoc({
//     el: '.slider',
//     arrow: true,
//     dots: true,
//     animation: {
//         type: 'linear',
//         speed: 0.3
//     },
//     autoPlay: true,
//     delay: 3000
    
// })