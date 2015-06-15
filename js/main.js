;(function(d) {
	var navElements = d.querySelectorAll('nav a');
	var wrapper = d.getElementById('wrapper');

	[].forEach.call( navElements, function( target ){
        target.addEventListener('click', function(e){
          e.preventDefault();

          [].forEach.call( navElements, function( target ){
            target.classList.remove('active');
          });

          e.currentTarget.classList.add('active');
          wrapper.src = e.currentTarget.href;
        });
    });
})(document);
