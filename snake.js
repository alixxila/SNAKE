//Récupérer l'id
var canvas = document.getElementById('zone');

//Définir le contexte a utiliser sur la zone du Canvas 2D ou 3D 
var ctx = canvas.getContext('2d');  

// Largeur et hauteur du réctangle
var largeur=hauteur = 20; // Hauteur = largeur, une ligne suffit pour les 2 variables vu qu'elles sont égales

// Coordonnées x et y positionnées au milieu de la surface du Canvas divisé par deux ( Math.trunc ) qui prend que la partie entière des divisions
var x = Math.trunc(Math.random()*canvas.width/largeur)*largeur; //Positionement aléatoire sur l'axe Y 
var y = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur; // Positionement aléatoire sur l'axe X

//Les deux variables qui vont s'occuper du déplacement
var deplacementX = deplacementY = 0; // Même valeur, même ligne.


var trace = [];
var tailleTrace = tailleInitTrace = 5;
var sautTrace = 1;
var tailleMaxTrace = 100;
var hist, compteBoucle = 0;
var sautBoucle = 10;


var PommeX = Math.trunc(Math.random()*canvas.width/largeur)*largeur; //Position de la pomme en X
var PommeY = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur; //Position de la pomme en Y 
var PommeRadius = 10; //Rayon de la pomme ( moitié de la largeur du serpent )
var score = 0;
var randomColor = 0;
var vie = 5;
var intervalID;
var timeout = 0;



window.onload=function() {

// Toutes les 10 ms exécute game ()
var intervalID = setInterval(game,100);

    // Ecoute de l'évenement keydown pour éxécuter la fonction "Keyboard"
    document.addEventListener("keydown",keyboard);
}

function game(){

    //Incrémentation
    x+=deplacementX*largeur;
    y+=deplacementY*hauteur;


    //On augmente tailleTrace toutes les secondes ( soit 100 boucles )
    if((tailleTrace <= tailleMaxTrace) && ((deplacementX != 0) || (deplacementY!=0))) {
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

    // Donner une couleur au réctangle grâce à la fonction fillStyle
    ctx.fillStyle="#f1c40f";

    // Dessin du réctangle avec la fonction fillRect qui a besoin des coordonées x et y définit dans nos variables
    for(var i=0;i<trace.length;i++) {
        ctx.fillRect(trace[i].x,trace[i].y, largeur -3, hauteur -3); //Modif affichage de la queue du serpent
    }

    if(x==PommeX && y==PommeY){ // Si les coordonées de la Pomme sont celles du serpent alors il y'a colision 
        score+= 10 + 2 * ((tailleTrace - tailleInitTrace)/sautTrace);
        //colision 
        if(tailleTrace>tailleInitTrace){
            tailleTrace-=sautTrace;
        }

    sautBoucle = 10; // On réinitisalise le compte à rebours pour relancer l'expension

    // On choisit une autre position pour la pomme 
    PommeX = Math.trunc(Math.random()*canvas.width/largeur)*largeur;

    PommeY = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;
    } 
    

    ctx.beginPath(); //Commencer un nouveau chemin pour séparer la pomme du serpent, si il faut rajouter un autre élément par la suite il va falloir en utiliser une autre par exemple
    ctx.arc(PommeX+PommeRadius, PommeY+PommeRadius, PommeRadius, 0, Math.PI * 2); //Méthode (arc) qui utilise le rayon de PommeRadius
    ctx.fillStyle="#e74c3c"; //Lui donner une couleur
    ctx.fill(); //Remplissage avec la couleur d'en haut

    //Pas de ctx.closePath() ça nous sert à rien dans notre cas

    //Affichage du score 
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText('Score: ' + score, 5, 20);

    //Affichage des vies
    ctx.font = '16px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText ('Vies restante: ' + vie, canvas.width - 130, 20);

    //Affichage d'une feuille sur la pomme grâce à un V en écrivant sur le canvas. 
    ctx.font = '16px Arial';
    ctx.fillStyle = '#2ecc71'; //Couleur de la branche de la pomme (vert)
    ctx.fillText('V', PommeX+4, PommeY+4 ); // Affichage du V qui représente la branche
    ctx.save(); 
    ctx.scale(1, 1.5); //Changement des proportions du contexte sur l'axe X 
   
    //Création d'un chemin/dessin pour le reflet de la pomme
    ctx.beginPath(); //On commence un nouveau chemin puisque qu'on dessine une nouvelle forme
    ctx.arc(PommeX+PommeRadius + 3, (PommeY+PommeRadius)/1.5,PommeRadius/3, 0, Math.PI * 2); // On dessine notre ovale mais en changeant Y (puisque tout est divisé par 1.5)
    ctx.fillStyle="#ed7365"; // On indique la couleur à appliquer à notre chemin (reflet) ici ce sera du blanc
    ctx.fill(); // Application du code couleur à notre chemin
    ctx.closePath(); //On ferme le chemin afin de compléter la forme
    ctx.restore()  // On restaure le contexte d'origine. Sans ça le canvas entier "s'écroule"

    if(x==PommeX && y==PommeY){
        // Incrementation de randomColor
         randomColor++;
         randomColor%=3;
    }
    ctx.fillStyle="#f1c40f";
    for(var i=0;i<trace.length;i++) {
        
    if(i==trace.length-1){
    switch(randomColor){

    case 0:
    ctx.fillStyle="#d35400"; 
    break;

    case 1:
    ctx.fillStyle="#9b59b6";
    break;
    
    default:
    ctx.fillStyle="#1abc9c"; 
    } 
    }
    ctx.fillRect(trace[i].x,trace[i].y, largeur-3, hauteur-3);
    }    



    if(x<0 || x>canvas.width || y<0 || y > canvas.height){
        //Perte de vie 
        timeout = 0;
        //On réinitialise la trace en effacant les valeurs sauvergardées
        while(trace.length>1){
            //Alors on enlève un élément
            trace.shift();
        }

        //On définit à nouveau une position du serpent
        x = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        y = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

        //On redonne la taille initiale de la trace
        tailleTrace=tailleInitTrace;

        //On définit à nouveau une position pour la pomme
        PommeX = Math.trunc(Math.random()*canvas.width/largeur)*largeur;
        PommeY = Math.trunc(Math.random()*canvas.height/hauteur)*hauteur;

        //On décrémente le nombre de vie
        vie--;

        if(vie == 0){
            //Afficher la fin de la partie
            ctx.font = '40px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText('GAME OVER SON OF A BITCH', canvas.width / 2 - 130, canvas.height / 2);
            document.getElementById('game-over').play();
            clearTimeout(intervalID);
            } else {
            document.getElementById('life').play();
        }

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