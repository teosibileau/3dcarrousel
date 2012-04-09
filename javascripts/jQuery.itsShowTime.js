;(function($, window, document, undefined){
    // Need to Store original slide dimensions
    function Slide(div){
         this.div=$(div);
         this.width=this.div.outerWidth();
         this.height=this.div.outerHeight();
    }
    var defaults = {
        step:10,
        initialDeg:Math.PI/2,
        slides_container:'.slides',
        slides_selector:'.slide',
        btn_selector:'.arrows .arrow',
        next_btn_class:'next',
        prev_btn_class:'prev',
        bullets_selector:'.bullets',
        rangeY:100,
        rangeX:200,
        rangeO:0.8,
        rangeD:0.6,
        timed:true,
        timer_interval:5000,
    };  
    // Constructor
     function itsShowTime(div,options){
         this.options = $.extend({}, defaults, options);
         this.div=$(div);
         this.slides=[];
         this.deg=null;
         this.inc=null;
         this.rotating=false;
         this.pending=0;
         this.active=0;
         this.initStyles();
         this.initSlides();
         this.initArrows();
         this.initBullets();
         this.rotate(0);
         if(this.options.timed){
             this.resetTimer();
             this.initHOverBehavior();
         }
     }
     // Attach necessary styles to make the carrousel work
     itsShowTime.prototype.initStyles=function(){
         var styles='<style> .%stage_class{position:relative;} .%stage_class %slides_class %slide_class{position:relative;display:inline-block;} .%stage_class %slides_class %slide_class.animationReady{display:block; position:absolute; top:0px; left:0px;} </style>';
         styles=styles.replace(/%stage_class/g,this.div.attr('class')).replace(/%slides_class/g,this.options.slides_container).replace(/%slide_class/g,this.options.slides_selector);
         this.div.append(styles);
     };
     // Initialize slides container with parent dimensions.
     // Initialize slides with proper css classes and store Slides intances in an array to access original dimensions
     itsShowTime.prototype.initSlides=function(){
         var cp=this;
         this.div.find(this.options.slides_container).width(this.div.width()).height(this.div.height());
         this.div.find(this.options.slides_selector).each(function(i){
            $(this).addClass('animationReady');
            cp.slides.push(new Slide(this));
         });
         cp.inc=360/cp.slides.length;
     };
     // Init behaviour for arrows (if any)
     itsShowTime.prototype.initArrows=function(){
       var cp=this;
       this.div.find(this.options.btn_selector).click(function(e){
           cp.go($(this).hasClass(cp.options.next_btn_class)?-1:1);
           cp.resetTimer();
           e.preventDefault();
       });  
     };
     itsShowTime.prototype.initBullets=function(){
       var cp=this;
       var bh=this.div.find(this.options.bullets_selector)
       if(bh.length==1){
           var t='<div class="bullet"><a href="#">bullet</a></div>';
           for(var i=0;i<this.slides.length;i++){         
               bh.append(t);
           }
           this.div.find('.bullet').each(function(i){
               if(i==0){
                   $(this).addClass('active');
               }
               $(this).click(function(e){
                   if(cp.active!=i){
                       cp.activate(i);
                       e.preventDefault();
                   }
               });
           });
       };
     };
     itsShowTime.prototype.resetTimer=function(){
       var cp=this;   
       this.div.stopTime();
       this.div.everyTime(this.options.timer_interval,function(e){
           cp.go(-1);
       });
     };
     itsShowTime.prototype.initHOverBehavior=function(){
       var cp=this;
       this.div.find(this.options.slides_container).hover(function(e){
           cp.div.stopTime();
       },function(e){
           cp.resetTimer();
       });
     };
     itsShowTime.prototype.activate=function(i){
             var sign=1;
             var steps=1;
             if(i<this.active){
                 steps=Math.abs(this.active-i);
                 sign=1;
                 if((this.slides.length-this.active+i)<steps){
                     steps=this.slides.length-this.active+i
                     sign=-1;
                 }
             }else{
                 steps=Math.abs(this.active-i);
                 sign=-1;
                 if((this.slides.length-i+this.active)<steps){
                     steps=this.slides.length-i+this.active;
                     sign=1;
                 }
             }
             this.go(sign*steps);
     };
     itsShowTime.prototype.go=function(m){
         var cp=this;
         // If its rotating right now, just add pending 
        if(!this.rotating){
            this.inc=360/this.slides.length*Math.abs(m);
            this.rotate(this.options.step*(Math.abs(m)/m));
        }else{
            this.pending+=m;
        }
        this.active-=m;
        this.active=this.active<0?this.slides.length+this.active:this.active;
        this.active=this.active>=this.slides.length?this.active-this.slides.length:this.active;
        this.div.find('.bullet').each(function(i){
           if(i==cp.active){
               $(this).addClass('active');   
           }else{
               $(this).removeClass('active');
           }
        });
     };
     // Rotate action, if step equals 0 then it just initializes the slides with proper coordinates.
     itsShowTime.prototype.rotate=function(step){
         var cp=this;
         var cx=this.div.width()/2;
         var cy=this.div.height()*3/8;
         var es,ec,nw,nh,q;
         this.rotating=step!=0?true:false;
         
         if(step!=0){
             this.deg+=((this.inc-Math.abs(step)<=0)?(step<0?-this.inc:this.inc):step);
         }else{
             this.deg=this.options.initialDeg*180/Math.PI;
         }
         this.div.find(this.options.slides_selector).each(function(i){
             slide=cp.slides[i];
             q=(360/cp.slides.length*i+(step==0?0:cp.deg))*Math.PI/180+(step==0?cp.options.initialDeg:0);
             es=Math.sin(q);
             ec=Math.cos(q);
             q=cp.options.rangeD+es*(1-cp.options.rangeD);
             nw=q*slide.width;
             nh=q*slide.height;
             $(this).css({
                 top:cy-nh/2+cp.options.rangeY*es,
                 left:cx+cp.options.rangeX*ec,
                 opacity:cp.options.rangeO+es*(1-cp.options.rangeO),
                 marginLeft:-nw/2,
                 zIndex:Math.round(80+es*20)   
             }).width(nw).height(nh);
             $(this).find('.scalable').width(nw).height(nh);
         });
         if(step!=0){
             this.inc-=Math.abs(step);
             if(this.inc<=0){
                 this.rotating=false;
                 if(this.pending!=0){
                     var m=this.pending<0?-1:1
                     this.inc=360/this.slides.length*Math.abs(this.pending);
                     this.pending=0;
                     this.rotate(m*this.options.step);  
                 }
                 this.resetTimer();
                 return false;
             }
             setTimeout(function(){cp.rotate(step)},40);
         }
     };
     // add the plugin to jQuery.fn
     $.fn.itsShowTime = function (options){
         return this.each(function () {
             if(!$.data(this, 'plugin_itsShowTime')){
                 $.data(this, 'plugin_itsShowTime', new itsShowTime(this,options));
             }
         });
     };
})(jQuery, window, document);
