/*
*Карусель
*Версия: 0.1
*Автор: Бакай Антон
*/
(function($){

    $.fn.comfortCarousel = function(options) {  
        
        var opt = {
            'width': '', // Ширина и высота области просмотра карусели
            'height': 340,
            'arrows': true, // Показывать стрелки переключения слайдов
            'arrowsHide': true,
            'auto': true, // Автопроигрывание
            'autoSpeed': 5000,
            'fadeSpeed': 400,
            'stepWidth': null,
            'blockValue' : 50 //мфксимальная величина сдвига, который будет игнорироваться
        };
        
        
        this.each(function() {        
            var jthis = $(this);
            if (options) { 
                $.extend(opt, options);
            }
            //if (!opt.width){}
            /* Контейнеры
            -----------------------------------------------*/
                jthis.children().wrapAll('<div class="comfort_carousel">');
                var container = jthis.find('.comfort_carousel');
                container.children().wrapAll('<div class="carousel_wrapper">');
                var wrapper = container.find('.carousel_wrapper');
                wrapper.children().wrapAll('<div class="carousel_tape">');

            /* Кнопки "следующий" и "предыдущий"
            -----------------------------------------------*/
                if (opt.arrows === true) {
                    container.append('<a href="#" class="carousel_prev" ><<</a><a href="#" class="carousel_next" >>></a>');
                }       
            
            
            /* Объект Carousel
            -----------------------------------------------*/       
            var Carousel = function(){
                this.caruselTape = wrapper.find('.carousel_tape');//Лента, которая будет сдвигаться при слайдинге
                
                var tepewidth = 0;
                this.caruselTape.children().css('float', 'left');//.last().css('margin-right', '0');
                this.caruselTape.children().each(function(){
                    tepewidth += $(this).outerWidth(true);
                });
                this.tapeWidth = tepewidth;//Длинна ленты

                this.caruselTape.css('width', this.tapeWidth);
                this.stepWidth = opt.stepWidth || this.caruselTape.children().first().outerWidth(true);//Длинна шага для сдвига
                this.wrapWidth = opt.width;//Ширина области просмотра
                this.curMargin = 0;//Текущая величина сдвига ленты
                this.minMargin = - this.tapeWidth + this.stepWidth;
                this.maxMargin = 0;
                this.blockValue = opt.blockValue;
                this.touchStartDate = 0;
                this.shiftStart = {'x': 0, 'y':0};
                this.shift = {'x': 0, 'y':0}; //величина тач сдвига

                //this.autoScrloll;

                if (opt.arrows === true) {
                    this.navPrev = container.find('a.carousel_prev');
                    this.navNext = container.find('a.carousel_next');
                }

                this.slide = function(shift){
                    /*if (shift > 0) {
                        this.slideLeft(shift);
                    } else if (shift < 0){
                        this.slideRight(shift);
                    }*/
                    if (Math.abs(shift) > this.blockValue){//если величина сдвига достаточна для прокрутки
                        var date = Date.now(),
                            speed = Math.abs(shift)/(date-this.touchStartDate),
                            acceleration = 1;
                        if (speed > 1 && speed < 2 ) {
                            acceleration = 2;
                        } else if (speed>=2){
                            acceleration = 3;
                        }
                            console.log(speed);




                        if (this.curMargin + shift < this.minMargin ) {//Уперлись в правый край
                            this.caruselTape.animate({
                                'margin-left' : (this.minMargin) +'px'
                            });
                        } else if (this.curMargin + shift > this.maxMargin) {
                            this.caruselTape.animate({
                                'margin-left' : (this.maxMargin) +'px'
                            });
                        } else {//прокручиваем 
                            console.log('currMargin:'+this.curMargin+'; shift:'+shift+ ' stepWidth:'+this.stepWidth+' margin-step:'+this.curMargin%this.stepWidth);
                            this.caruselTape.stop(false, false).animate({
                                'margin-left' : ''+ ( -this.stepWidth + this.curMargin - shift + (this.curMargin%this.stepWidth -shift) ? -this.curMargin%this.stepWidth : 0)+ 'px'
                            });

                            /*if (this.curMargin%this.stepWidth != 0){
                                this.caruselTape.stop(false, false).animate({
                                    'margin-left' : '-='+ (this.stepWidth + shift + this.curMargin%this.stepWidth)+ 'px'
                                });
                            } else {
                                this.caruselTape.stop(false, false).animate({
                                    'margin-left' : '-='+ (this.stepWidth + shift)+ 'px'
                                });
                            }*/
                        }
                    } else {//возвращаем обратно
                        this.caruselTape.animate({
                            'margin-left' : this.curMargin - shift
                        });
                    }
                };
                this.slideRight = function(shift){
                    if (shift !== undefined){//если был сдвиг тачем
                        if (Math.abs(shift) > this.blockValue){//если величина сдвига достаточна для прокрутки
                            var date = Date.now(),
                                speed = Math.abs(shift)/(date-this.touchStartDate),
                                acceleration = 1;
                            if (speed > 1 && speed < 2 ) {
                                acceleration = 2;
                            } else if (speed>=2){
                                acceleration = 3;
                            }
                                console.log(speed);




                            if (this.curMargin + shift < this.minMargin ) {//Уперлись в правый край
                                this.caruselTape.animate({
                                    'margin-left' : (this.minMargin) +'px'
                                });
                            } else {//прокручиваем 
                                

                                /*if (this.curMargin%this.stepWidth != 0){
                                    this.caruselTape.stop(false, false).animate({
                                        'margin-left' : '-='+ (this.stepWidth + shift + this.curMargin%this.stepWidth)+ 'px'
                                    });
                                } else {
                                    this.caruselTape.stop(false, false).animate({
                                        'margin-left' : '-='+ (this.stepWidth + shift)+ 'px'
                                    });
                                }*/
                            }
                        } else {//возвращаем обратно
                            this.caruselTape.animate({
                                'margin-left' : this.curMargin
                            });
                        }
                    } else {
                        var correctstep = 0;
                        if (this.curMargin%this.stepWidth != 0){
                            correctstep = this.curMargin%this.stepWidth;
                        }
                        if (this.curMargin > this.minMargin ) {
                            this.caruselTape.animate({
                                'margin-left' : '-='+ (this.stepWidth + correctstep) +'px'
                            });
                            this.curMargin -= this.stepWidth + correctstep;
                        } else {
                            this.caruselTape.animate({
                                'margin-left' : 0
                            });
                            this.curMargin = 0;
                        }
                    }

                    
                };
                this.slideLeft = function(){
                    /*if ( this.curMargin < 0 ) {
                        this.caruselTape.animate({
                            'margin-left' : '+='+this.stepWidth+'px'
                        });
                        this.curMargin += this.stepWidth;
                    } else {
                        this.caruselTape.animate({
                            'margin-left' : this.wrapWidth - this.tapeWidth
                        });
                        this.curMargin = this.wrapWidth - this.tapeWidth;
                    }*/
                };
        
                this.init = function(){ // Инициализация
                    wrapper
                        .width(opt.width)
                        .height(opt.height)
                        .css({'overflow': 'hidden', 'position': 'relative'}); /* Устанавливаем высоту и ширину */
                    this.caruselTape.addClass('clearfix');
                    
                    if (opt.arrows === true && opt.arrowsHide === true) {
                        this.navPrev.hide();
                        this.navNext.hide();
                    }

                };

            };
            
            var carousel = new Carousel();
            carousel.init();        
            
            
            /* События мыши
            -----------------------------------------------*/
            if (opt.arrows === true) {
                if (opt.arrowsHide === true) {
                    container.hover(function(){ // Курсор над контейнером
                        carousel.navNext.stop(true, true).fadeIn();
                        carousel.navPrev.stop(true, true).fadeIn();
                        
                    }, function(){
                        carousel.navNext.stop(true, true).fadeOut();
                        carousel.navPrev.stop(true, true).fadeOut();
                    });
                }
                carousel.navNext.click(function(e){ // Нажатие на кнопке "следующий"
                    e.preventDefault();
                    //e.stopProragation();
                    carousel.slideRight(); 
                });
                carousel.navPrev.click(function(e){ // Нажатие на кнопке "предыдущий"
                    e.preventDefault();
                    carousel.slideLeft();
                });
            }
            
            
            
            /* Автопроигрывание
            -----------------------------------------------*/           
            if (opt.auto === true) {

                var timer = function(){
                        carousel.slideRight();
                };
                var interval = setInterval(timer, opt.autoSpeed);
    
                // Пауза при навещении курсора мыши на изображение
                container.hover(function(){clearInterval(interval);}, function(){interval=setInterval(timer, opt.autoSpeed);});
        
            }

            /* Тач события
            -----------------------------------------------*/
                carousel.caruselTape.bind({
                    //ТачСтарт
                    'touchstart.touchSlides': function(e) {
                        var eo = e.originalEvent.touches[0];
                        carousel.shiftStart.x = eo.pageX;
                        carousel.shiftStart.y = eo.pageY;
                        //$(this).css('-webkit-transition', 'none');
                        carousel.touchStartDate = Date.now();
                        carousel.caruselTape.stop(false, false);
                        carousel.curMargin = parseInt(carousel.caruselTape.css('margin-left'));
                    },
                    // move
                    'touchmove.touchSlides': function(e) {
                        var eo = e.originalEvent.touches[0];
                        carousel.shift.x = eo.pageX - carousel.shiftStart.x;
                        carousel.shift.y = eo.pageY - carousel.shiftStart.y;

                        if (Math.abs(carousel.shift.x) > Math.abs(carousel.shift.y)){
                            carousel.caruselTape.css('margin-left', carousel.curMargin + carousel.shift.x);
                            e.preventDefault();
                            console.log(parseInt(carousel.caruselTape.css('margin-left')));
                        }
                        
                        //console.log('touch move '+carousel.shift);
                    },
                    // end
                    'touchend.touchSlides': function(e) {
                        carousel.curMargin = parseInt(carousel.caruselTape.css('margin-left'));
                        carousel.slide(carousel.shift.x);
                    },
                });
            
        });
        
    };
})(jQuery);

