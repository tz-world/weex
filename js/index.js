function setFloatEleCentre(eleList,maxWidth){
    var wWidth = ( maxWidth &&  (maxWidth < $(document).width())  )  ? maxWidth : $(document).width() ;
    var eWidth = eleList[0].width();
    rList = eleList.slice(1);
    for (var i = 0 ; i< rList.length ; i++){
        eWidth += rList[i].width();
        eWidth += parseInt(rList[i].css('margin-left'));
    }
    eleList[0].css('margin-left', ((wWidth - eWidth) / 2)+ 'px' );   
}

function setPos(){
    setFloatEleCentre([$('.entrance div:nth-child(1)'),$('.entrance div:nth-child(2)')]); 
    setFloatEleCentre([$('.high-light div:nth-child(1)'), $('.high-light div:nth-child(2)')],1200); 
    setFloatEleCentre([$('.code-show .code') , $('.code-show .show')],1200);
}


$(window).resize(function() {
    setPos() 
})

$(document).scroll(function(){
    if ( $(window).scrollTop() > 150){
        $('.top-bar').addClass('fade');
    }else{
        $('.top-bar').removeClass('fade')    
    }
})

$(document).ready(function(){
    setPos();
})
