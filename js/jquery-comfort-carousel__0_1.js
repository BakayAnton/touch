/*
*Карусель
*Версия: 0.1
*Автор: Бакай Антон
*/
(function($){

	$.fn.comfortCarousel = function(options) {  
		
		var opt = {
			'width': 908, // Ширина и высота области просмотра карусели
			'height': 340,
			'arrows': true, // Показывать стрелки переключения слайдов
			'arrowsHide': true,
			'auto': true, // Автопроигрывание
			'autoSpeed': 5000,
			'fadeSpeed': 400
		};
		
		
		this.each(function() {        
			var jthis = $(this);
			if (options) { 
				$.extend(opt, options);
			}

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
				this.caruselTape = wrapper.find('.carousel_tape');
				
				var tepewidth = 0;
				this.caruselTape.children().css('float', 'left').last().css('margin-right', '0');
				this.caruselTape.children().each(function(){
					tepewidth += $(this).outerWidth(true);
				});
				this.tapeWidth = tepewidth;

				this.caruselTape.css('width', this.tapeWidth);
				this.stepWidth = this.caruselTape.children().first().outerWidth(true);
				this.wrapWidth = opt.width;
				this.curMargin = 0,
				this.autoScrloll;

				if (opt.arrows === true) {
					this.navPrev = container.find('a.carousel_prev');
					this.navNext = container.find('a.carousel_next');
				}

				
				this.slideRight = function(){
					if ( this.tapeWidth + this.curMargin > this.wrapWidth ) {
						this.caruselTape.animate({
							'margin-left' : '-='+this.stepWidth+'px'
						});
						this.curMargin -= this.stepWidth;
					} else {
						this.caruselTape.animate({
							'margin-left' : 0
						});
						this.curMargin = 0;
					}
				};
				this.slideLeft = function(){
					if ( this.curMargin < 0 ) {
						this.caruselTape.animate({
							'margin-left' : '+='+this.stepWidth+'px'
						});
						this.curMargin += this.stepWidth;
					} else {
						this.caruselTape.animate({
							'margin-left' : this.wrapWidth - this.tapeWidth
						});
						this.curMargin = this.wrapWidth - this.tapeWidth;
					}
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
		});
		
	};
})(jQuery);

