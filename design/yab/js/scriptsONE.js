// =================================================2.MASONRY БИБЛИОТЕКА
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/** jQuery Masonry v2.1.08
* A dynamic layout plugin for jQuery
* The flip-side of CSS Floats
* http://masonry.desandro.com
* Licensed under the MIT license.
* Copyright 2012 David DeSandro */
(function (f,e,l) {var h=e.event;
h.special.smartresize={
setup:function(){e(this).bind('resize', h.special.smartresize.handler)},
teardown:function(){e(this).unbind('resize', h.special.smartresize.handler)}, 
handler:function(a){var b=this,d=arguments;a.type='smartresize';h.dispatch.apply(b,d)}
};
e.fn.smartresize=function(a){return this.trigger('smartresize')};

//========здесь создается объект
e.Mason=function(a,c) {this.element=e(c);this._create(a);this._init();};
//параметры для прототипа
e.Mason.settings={isResizable:!0, isAnimated:!1, animationOptions:{queue:!1, duration:500},isRTL:!1,isFitWidth:!1,containerStyle:{position:'relative'}};

//тут происходит все
e.Mason.prototype={_filterFindBricks:function(a) {var c=this.options.itemSelector;return c?a.filter(c).add(a.find(c)):a}, 
_getBricks:function(a) {return this._filterFindBricks(a).css({position:'absolute'})},
//========================================3
 _create:function(a) {
this.options=e.extend(!0, {}, e.Mason.settings, a);
this.styleQueue=[];
a=this.element[0].style;

this.originalStyle={height:a.height||''};
var c=this.options.containerStyle, b;
for (b in c) {this.originalStyle[b]=a[b]||'';}
this.element.css(c);
this.horizontalDirection=this.options.isRTL?'right':'left';
b=this.element.css('padding-'+this.horizontalDirection);
a=this.element.css('padding-top');
this.offset={x:b?parseInt(b,10):0, y:a?parseInt(a, 10):0};
var d=this;

this.options.isResizable && e(f).bind('smartresize.masonry', function() {d.resize()});
this.reloadItems()}, 
///////////////////////////////////////////
_init:function(a) {this._getColumns();this._reLayout(a)}, 
option:function(a, c) {e.isPlainObject(a) && (this.options=e.extend(!0, this.options, a))},
//===========================================
layout:function(a, c) {
for (var b=0, d=a.length;b < d;b++) {this._placeBrick(a[b])}
d={};
d.height=Math.max.apply(Math, this.colYs);

if (this.options.isFitWidth) {for (var e=0, b=this.cols;--b && 0 === this.colYs[b];) {e++;}
d.width=(this.cols - e) * this.columnWidth;}
this.styleQueue.push({$el:this.element, style:d});
for (var e=this.isLaidOut ? this.options.isAnimated?'animate':'css':'css', g=this.options.animationOptions, f, b=0, d=this.styleQueue.length;b < d;b++) 
{f=this.styleQueue[b], f.$el[e](f.style, g)}
this.styleQueue=[];c && c.call(a);this.isLaidOut=!0;

/*===создаем скролл бар, и если существует команда опустить триггер вниз, то записываем*/
body.rollbar({type:'primary',block:'#container',contentH:Math.max.apply(Math,this.colYs)});
/*==========================================================================================*/
}, 
_getColumns:function() {
var a=(this.options.isFitWidth?this.element.parent():this.element).width();
this.columnWidth=this.options.columnW||this.$bricks.outerWidth(!0);
this.cols=Math.floor(a/this.columnWidth);this.cols=Math.max(this.cols,1)},

_placeBrick:function(a) {
a=e(a);
var c, b, d, f, g;
c=Math.ceil(a.outerWidth(!0) / this.columnWidth);
c=Math.min(c, this.cols);
if (1 === c) {
d=this.colYs;
} else {
for (b=this.cols + 1 - c, d=[], g=0;g < b;g++) {
f=this.colYs.slice(g, g + c), d[g]=Math.max.apply(Math, f);
}
}
g=Math.min.apply(Math, d);
b=c=0;
for (f=d.length;b < f;b++) {
if (d[b] === g) {
c=b;
break;
}
}
d={top:g + this.offset.y};
d[this.horizontalDirection]=this.columnWidth*c + this.offset.x;
this.styleQueue.push({$el:a, style:d});
a=g + a.outerHeight(!0);
d=this.cols + 1 - f;
for (b=0;b < d;b++) {
this.colYs[c + b]=a;
}},


resize:function() {var a=this.cols;this._getColumns();(this.cols!==a)&&this._reLayout()},
_reLayout:function(a) {var c=this.cols;
for (this.colYs=[];c--;) {this.colYs.push(0)}
this.layout(this.$bricks, a)},
reloadItems:function() {this.$bricks=this._getBricks(this.element.children())}, 
};

e.fn.masonry=function(a) {
if ('string' == typeof a) {var c=Array.prototype.slice.call(arguments, 1);
this.each(function() {var b=e.data(this, 'masonry')});
} 
else {this.each(function() {var b=e.data(this, 'masonry');
b?(b.option(a||{}), b._init()) : e.data(this, 'masonry', new e.Mason(a, this))});
}return this;
};
/* /////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// */


/* СКРОЛЛБАР */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
/* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
Roll=function(c,s){this.settings=s;/*главный контейнер*/this.container=$(c);
/*1*/this.get();/*2*/this.path();/*3*/this.create();/*4*/this.bind()}

Roll.prototype={
get:function(){
this.containerW=this.container.width();
// получаем считаем и придаем размер детям главного контейнера
this.blocks=this.container.children(this.settings.block);
this.blocksA=this.blocks.length;
this.blocks.css('width',100/this.blocksA+'%')},

path:function(){
this.headerH=(this.settings.type=='primary')?header.outerHeight():0;
this.containerH=this.container.height();
this.contentH=this.settings.contentH+this.headerH+10;
//======================================
this.VtriggerH=(this.containerH-this.headerH)/this.contentH;
this.Vpath=(1-this.VtriggerH)*this.container.height()-this.headerH-20;
this.Vcontent=(this.contentH-this.containerH)/this.Vpath
},

create:function(){
this.handleStop=$('<b>✖</b>')
this.Vtrigger=$('<div class="rollbar-handle"></div>').css({'margin-top':this.headerH+10,'left':this.settings.left,'height':this.VtriggerH*100+'%'});
if(this.Vtrigger.position().top<30){this.Vtrigger.append(this.handleStop);}
// ===============если заданно создать вертикальный скролл или блоков контента больше одного
if(this.blocksA>1||this.settings.rollbarY){
if(this.settings.type=='primary'){
/*удаление триггера*/$('.rollbar-handle').remove();this.content=this.blocks.css('margin-top',this.headerH+5)}
else{
this.wrapper=$('<div class="rollbar-content"></div>').css('width',this.blocksA*100+'%')
this.container.css({'position':'relative','overflow':'hidden'}).contents().wrapAll(this.wrapper)
this.content=this.container.contents().css('height',this.contentH)}

this.container.prepend(this.Vtrigger);
this.contentW=this.content.width()}
},

bind:function(){
// =============ЕСЛИ ЗАДАН ГОРИЗОНТАЛЬНЫЙ СЛАЙДЕР, ТО СОЗДАЕМ КОНТРОЛЛЕРЫ
if(this.settings.type=='viewerX'&& this.blocksA>1) {
/*контрол.вьювер*/this.viewerXnext=$('<span class="thumbs-next"> >> </span>'),this.viewerXprev=$('<span class="thumbs-prev"> << </span>');
this.container.prepend(this.viewerXprev.add(this.viewerXnext));this.viewerXprev.hide()
/*бинд кнопки след.*/this.bindEvent(this.viewerXnext,'click',function (e){var step=this.content.position().left-this.containerW;
this.content.animate({'left':step},300)
if(this.contentW-this.containerW==-step)this.viewerXnext.hide();this.viewerXprev.show()
})

/*бинд кнопки пред.*/this.bindEvent(this.viewerXprev,'click',function (e){var step=this.content.position().left+this.containerW;
this.content.animate({'left':step},300)
if(step==0)this.viewerXprev.hide();this.viewerXnext.show()})
}
//  КНОПКИ ВВРЕХ/ВНИЗ
this.bindEvent(this.container,'keydown', function (e){TOP=Math.abs(this.Vtrigger.position().top);
/* вверх */if(e.keyCode==38)this.scroll(TOP-10,'none');/* вниз */if(e.keyCode==40)this.scroll(TOP+10,'none')});


// КОЛЕСО МЫШИ
this.bindEvent(this.container, 'mousewheel',function (e){var a,TOP=Math.abs(this.Vtrigger.position().top);
event=event||window.event;event.wheelDelta?(a=0<event.wheelDelta?1:-1,window.opera&&(a=-a)):event.detail&&(a=-event.detail);event.returnValue=!1;
this.scroll(TOP-10*a,"none")
 });

// ЗАХВАТ МЫШКОЙ
this.bindEvent(this.Vtrigger, 'mousedown',function (e){this.pressed=(e.target===this.Vtrigger.get(0))?1:2;
b=e.pageY,c=this.Vtrigger.position().top,e.preventDefault();
this.bindEvent(wndw,'mousemove',function (e){if(this.pressed==1)this.scroll(c+e.pageY-b,'none')});
});

this.bindEvent(wndw,'mouseup',function (e){this.pressed=0;wndw.unbind('mousemove')});
// СОЗДАННЫЙ ТРИГГЕР
this.bindEvent(this.container,'rollbar',function (e,v,h){
e.stopPropagation();h*=this.content.width(); this.scroll(v,h)})
},
bindEvent:function(t,e,f){var a=this;t.on(e,function(){f.apply(a,arguments)})},

scroll:function(v,h){
/*Y*//* не больше, не меньше границ */if(v<0)v=0;
if(v>this.Vpath){v=this.Vpath;this.handleStop.css({'bottom':0,'display':'block','top':''})}
else if(v==0){this.handleStop.css({'top':0,'display':'block','bottom':''})}
else{this.handleStop.css('display','none')}

/* стилизация шага траггера */this.Vtrigger.css('top',v);
/* стилизация шага контента */this.content.css('top',-v*this.Vcontent);
/*X*/if(h!='none')this.content.css('left',-h)}
}

e.fn.rollbar=function(s){/*закидываем в конструктор настройки*/var a={rollbarX:false,rollbarY:true,viewerX:false},finish=this.length;
$.extend(a,s);this.each(function(i){new Roll(this,a)
if(++i==finish&&a.type=='viewerX') containerM.masonry({itemSelector:'.item',columnW:300})})
};
})(window,$);
/* /////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// */
/* /////////////////////////////////////////////////////////////////// */