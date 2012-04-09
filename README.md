# jQuery 3D Carrousel

This is a jQuery plugin that allows you to create 3D Carrousels limited just to your needs. Given certain boundaries, it takes care of layout, next-prev actions, bullets and timed transitions for you.

## Dependencies 

If you crave for automatic timed transitions you will need to load the awesome jQuery Timers plugin (http://archive.plugins.jquery.com/project/timers). There's a copy included to ease setup.

## How to use

Add your markup

```html
  <div id="stage" class="stage">
    <div class="slides">
      <div class="slide"><img class="scalable" src="img/delpo.png" width="334" height="286"/>0</div>
      <div class="slide"><img class="scalable" src="img/delpo.png" width="334" height="286"/>1</div>
      <div class="slide"><img class="scalable" src="img/delpo.png" width="334" height="286"/>2</div>
      <div class="slide"><img class="scalable" src="img/delpo.png" width="334" height="286"/>3</div>
      <div class="slide"><img class="scalable" src="img/delpo.png" width="334" height="286"/>4</div>
    </div>
    <div class="arrows">
      <a class="prev arrow" href="#">prev</a>
      <a class="next arrow" href="#">next</a>
    </div>
    <div class="bullets">
    </div>
  </div>
  <style>
    /* Give your stage proper dimensions */
    .stage{
        margin:0 auto;
        width:700px;
        height:450px;
    }
    .stage .slides{
        background-color:#eee;
    }
    .stage .bullets .bullet.active a{
        color:black;
    }
  </style>
```

Notice that we give explicit dimensions to the stage div. This is extremely important because the plugin builds layout base on them. It's the only layout you have to provide to assure proper functionality.

Load js libraries and pass the constructor certain options (or use defaults) for jQuery selectors and stuff.

```html
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
<script type="text/javascript" src="jQuery.timers.js"></script>
<script type="text/javascript" src="jQuery.itsShowTime.js"></script>
<script>
  $(function(){
  var options={
        slides_container:'.slides',
        slides_selector:'.slide',
        btn_selector:'.arrows .arrow',
        next_btn_class:'next',
        prev_btn_class:'prev',
        bullets_selector:'.bullets',
        timed:true,
        timer_interval:5000,
    }
		$('#stage').itsShowTime(options);
	});
</script>
```

You could use this default markup or your own classes, just remember to pass any customization through the options object during construction. 
