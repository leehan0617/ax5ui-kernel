/* 
	test.mask.js
	TODO event test 
*/
/* ax5.mask.setConfig */
describe('ax5.mask.setConfig TEST', function(){
	it('using setConfig', function() {
    	var mask = new ax5.ui.mask();
			mask.setConfig({
			    zIndex: 1000, 
			    content: 'Loading content',
			    onStateChanged: function(){
			        console.log(this);
			    },
			    onClick: function(){
			        console.log(this);
			    }
		});

		should.deepEqual(JSON.stringify(mask.config.zIndex) , '1000');
		should.deepEqual(mask.config.content , 'Loading content');
    });

    it('without using setConfig' , function(){
    	var mask = new ax5.ui.mask({
		    zIndex: 1000, 
		    content: 'Loading content',
		    onStateChanged: function(){
		       console.log(this);
		    },
		    onClick: function(){
		        console.log(this);
		    }
		});

		should.deepEqual(JSON.stringify(mask.config.zIndex) , '1000');
		should.deepEqual(mask.config.content , 'Loading content');
    });
});
/* end ax5.mask.setConfig */

/* ax5.mask.open */
describe('ax5.mask.open TEST' , function(){
	it('ax5.mask.open config' , function(){
		var mask = new ax5.ui.mask();
		should.deepEqual(typeof mask.open , "function");
	});

	it('ax5.mask.open with config' , function(){
		var mask = new ax5.ui.mask({
			target : $('body').get(0),
			content : 'mask'
		});
		should.deepEqual(typeof mask.open , "function");
	});
});
/* end ax5.mask.open */

/* ax5.mask.close*/
describe('ax5.mask.close TEST' , function(){
	it('ax5.mask.close config' , function(){
		var mask = new ax5.ui.mask();

		should.deepEqual(typeof mask.close , 'function');
	});
});
/* end ax5.mask.close*/