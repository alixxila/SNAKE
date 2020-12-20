//Récupérer l'id
var canvas = document.getElementById('zone');

//Définir le contexte a utiliser sur la zone du Canvas 2D ou 3D 
var ctx = canvas.getContext('2d');  

// Largeur et hauteur du réctangle
var largeur = 20;
var hauteur = 20;

// Coordonnées x et y positionnées au milieu de la surface du Canvas divisé par deux ( Math.trunc ) qui prend que la partie entière des divisions
var x = Math.trunc(canvas.width/2);
var y = Math.trunc(canvas.height/2);

//Les deux variables qui vont s'occuper du déplacement
var deplacementX = 0;
var deplacementY = 0;

var trace=[];
var tailleTrace=50;
var sautTrace=10;
var tailleMaxTrace=1000;
var hist = 0;
var compteBoucle = 0;
var sautBoucle = 10;

// Toutes les 10 ms exécute game ()
var intervalID = setInterval(game,10);

    // Ecoute de l'évenement keydown pour éxécuter la fonction "Keyboard"
    document.addEventListener("keydown",keyboard);

function game(){
    //Incrémentation
    x+=deplacementX;
    y+=deplacementY;

    //On augmente tailleTrace toutes les secondes ( soit 100 boucles )
    if ((tailleTrace <= tailleMaxTrace) && ((deplacementX != 0) || (deplacementY!=0))) {
        if((compteBoucle++)%100 == 1){
            sautBoucle--;
            if(sautBoucle<0){
            tailleTrace+=sautTrace;
            }
        }
    }
    //Insérer la valeur de x et y dans notre tableau
    trace.push({x:x,y:y});
    //Tant que le tableau dépase la taille maximum alors on enlève un élement
    while(trace.length>tailleTrace){
        trace.shift()    
    }
    // Effacer la zone du canvas via la fonction (clearRect)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Donner du style au réctangle grâce à la fonction fillStyle
    ctx.fillStyle="#f1c40f";
    // Dessin du réctangle avec la fonction fillRect qui a besoin des coordonées x et y définit dans nos variables
    for(var i=0;i<trace.length;i++) {
        ctx.fillRect(trace[i].x,trace[i].y, largeur, hauteur);
    }

}

function keyboard(evt){

    switch(evt.keyCode) {

        //On sauvegarde les précédents déplacements dans la valeur hist
        //Si elle est égale à la touche inverse qui est tapée alors on fait un break
        case 37:
        // Gauche
        if(hist==39) {break;}
        deplacementX=-1;
        deplacementY=0;
        hist=evt.keyCode;
        break;
        
        case 38:
        // Touche haut
        if(hist==40) {break;}
        deplacementX=0;
        deplacementY=-1;
        hist=evt.keyCode;
        break;

        case 39:
        // Touche droite
        if(hist==37) {break;}
        deplacementX=1;
        deplacementY=0;
        hist=evt.keyCode;
        break;

        case 40:
        // Touche bas
        if(hist==38) {break;}
        deplacementX=0;
        deplacementY=1;
        hist=evt.keyCode;
        break;

        case 32:
        // Touche espace
        deplacementX=0;
        deplacementY=0;
        break;

        // Des touches seront rajoutées par la suite ! ( Mettre en pause, ouvrir l'aide...)

    }

}