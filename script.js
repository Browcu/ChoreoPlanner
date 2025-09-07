document.addEventListener('DOMContentLoaded', async() => {

  /* ====== DOM ====== */
  const descModal = document.getElementById('descModal');
const descTitle = document.getElementById('descTitle');
const descContent = document.getElementById('descContent');
const closeDescBtn = document.getElementById('closeDescBtn');

  const svg = document.getElementById('stageSvg');
  const danceNameEl = document.getElementById('danceName');
  const selIndex = document.getElementById('selIndex');
  const selName = document.getElementById('selName');
  const selLead = document.getElementById('selLead');
  const selFollow = document.getElementById('selFollow');
  const selBoth = document.getElementById('selBoth');
  const selLink = document.getElementById('selLink');
  const bendRange = document.getElementById('bendRange');
  const bendPosRange = document.getElementById('bendPosRange');
  const resetBendBtn = document.getElementById('resetBendBtn');
  const resetBendPosBtn = document.getElementById('resetBendPosBtn');
  const selColor = document.getElementById('selColor');
  const updatePointBtn = document.getElementById('updatePointBtn');
  const newBtn = document.getElementById('newBtn');
  const saveBtn = document.getElementById('saveBtn');
  const openBtn = document.getElementById('openBtn');
  const editBtn = document.getElementById('editBtn');
  const clearBtn = document.getElementById('clearBtn');
  const closeBtn = document.getElementById('closeBtn');
  const figureListEl = document.getElementById('figureList');
  const toggleAddBtn = document.getElementById('toggleAddBtn');
  const toggleDragBtn = document.getElementById('toggleDragBtn');
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn');

  const libraryModal = document.getElementById('libraryModal');
  const libraryList = document.getElementById('libraryList');
  const libraryEmpty = document.getElementById('libraryEmpty');
  const closeLibBtn = document.getElementById('closeLibBtn');
  const saveCurrentBtn = document.getElementById('saveCurrentBtn');
  const copyShareBtn = document.getElementById('copyShareBtn');

  /* ====== STATE ====== */
  let state = { name: 'bez nazwy', points: [], closed: false, edit: true, selected: -1 };
  let dragging = null;
  let addPointsEnabled = true;
  let dragEnabled = true;
  let library = [];
  let customFigures = [];


  /* ====== FIGURES ====== */
  const figures = [
    /* ====== WALC ANGIELSKI ====== */
    {
        name: 'Natural Turn - Walc Angielski',
        color: '#ff6347',
        description: 'Podstawowy obrót w prawo, składający się z 6 kroków (2 taktów muzyki 3/4). Zaczyna się dla partnera krokiem prawej nogi w przód w kierunku tańca (LOD) z obrotem w prawo. Para wykonuje 3/8 obrotu w pierwszym takcie i kolejne 3/8 w drugim takcie, kończąc przodem do centrum (FDC). Charakterystyczny jest płynny ruch "rise and fall" - wznoszenie pod koniec kroku 1 i opadnięcie na koniec kroku 3.',
        videoLink: 'https://www.youtube.com/watch?v=6RGcF2fu25U'
    },
    {
        name: 'Whisk - Walc Angielski',
        color: '#4682b4',
        description: 'Krok boczny i do tyłu, w którym wolna noga zamyka się do nogi obciążonej bez przenoszenia ciężaru, kończąc w pozycji CBMP (Counter Body Movement Position). Partner kończy w pozycji promenady (PP), podczas gdy partnerka zamyka nogi. Figura pełni często funkcję łączącą lub przygotowującą do wejścia w promenadę.',
        videoLink: 'https://www.youtube.com/watch?v=ZvK3GbeqFgI'
    },
    {
        name: 'Chasse from PP - Walc Angielski',
        color: '#32cd32',
        description: 'Szybka, ślizgająca się sekwencja kroków (Side-Close-Side) wykonywana z pozycji promenady (Promenade Position - PP). Ciało jest zwrócone w kierunku ruchu, a partnerzy poruszają się równolegle w linii ukośnej. Charakteryzuje się lekkością i dynamizmem.',
        videoLink: 'https://www.youtube.com/watch?v=4Fz4FdNc7eE'
    },
    {
        name: 'Natural Spin Turn - Walc Angielski',
        color: '#ff4500',
        description: 'Zaawansowana figura obrotowa, będąca rozwinięciem Natural Turn. Składa się z pełnego obrotu w prawo (360 stopni), często wykonywanego po kącie. Na krokach 4-6 występuje charakterystyczny "spin" (obrót na pięcie) partnera, po którym następuje opadnięcie w tył na lewą nogę. Wymaga dobrej równowagi i kontrolowania odśrodkowej siły obrotu.',
        videoLink: 'https://www.youtube.com/watch?v=9Xz7cZe3uJ0'
    },
    {
        name: 'Basic Weave - Walc Angielski',
        color: '#8a2be2',
        description: 'Figura skrętna, która nie przechodzi przez pozycję promenady. Zaczyna się tyłem do kierunku tańca (dla partnera) i polega na serii obrotów w prawo, prowadzących do przemieszczenia się w linii ukośnej. Kroki są płynne i ciągłe, a sylwetka pozostaje zamknięta. Nazwa ("splot") nawiązuje do zygzakowatej ścieżki, jaką para zakreśla na parkiecie.',
        videoLink: 'https://www.youtube.com/watch?v=3QY4F0a-7-4'
    },
    {
        name: 'Natural Turning Lock - Walc Angielski',
        color: '#ff1493',
        description: 'Połączenie obrotu i kroku zamykającego (lock step). Wykonywany w prawo, często po kącie. Krok "lock" polega na skrzyżowaniu prawej nogi za lewą (dla partnera) w ruchu w tył, co pozwala na kontrolowane i szybkie odwrócenie kierunku ruchu przy jednoczesnym obrocie. Wymaga doskonałej synchronizacji między partnerami.',
        videoLink: 'https://www.youtube.com/watch?v=2QY4F0a-7-4'
    },
    {
        name: 'Running Weave - Walc Angielski',
        color: '#ff8c00',
        description: 'Szybsza i bardziej dynamiczna wersja Basic Weave. Charakteryzuje się mniejszym obrotem na pierwszych krokach, co nadaje figurze bardziej "biegnący", progresywny charakter. Często używana do pokonywania większych odległości na parkiecie lub jako efektowny finał sekwencji obrotów.',
        videoLink: 'https://www.youtube.com/watch?v=4QY4F0a-7-4'
    },
    {
        name: 'Double Reverse Spin - Walc Angielski',
        color: '#a52a2a',
        description: 'Szybki, ostry obrót w lewo (reverse) o 360 stopni, wykonywany w ciągu dwóch kroków (2 i 3). Partner wykonuje obrót prawie w miejscu, używając akcji skrętnej stóp i tułowia, podczas gdy partnerka jest mocno prowadzona wokół niego. Kończy się tyłem do kierunku tańca (dla partnera), często będąc przygotowaniem do figur takich jak Back Lock czy Weave.',
        videoLink: 'https://www.youtube.com/watch?v=5QY4F0a-7-4'
    },
    {
        name: 'Wing - Walc Angielski',
        color: '#b22222',
        description: 'Figura, w której partner prowadzi partnerkę do ruchu wokół jego prawej strony, podczas gdy on sam pozostaje niemal w miejscu, otwierając swoje ciało w prawo (tzw. "lateral swing"). Partnerka wykonuje trzy kroki (Forward, Side, Close) wokół partnera, kończąc w zamkniętej pozycji. Wymaga subtelnego i precyzyjnego prowadzenia ramieniem prawym partnera.',
        videoLink: 'https://www.youtube.com/watch?v=6QY4F0a-7-4'
    },
    {
        name: 'Outside Spin - Walc Angielski',
        color: '#d2691e',
        description: 'Figura, w której partner prowadzi partnerkę do obrotu w prawo pod jego uniesioną lewą ręką, podczas gdy on sam przyjmuje pozycję "outside" (na zewnątrz) względem niej, kończąc w promenadzie lub fallaway. Partnerka wykonuje obrót o 360 stopni, a partner jedynie niewielki obrót ciała, aby ją wypuścić i przyjąć z powrotem.',
        videoLink: 'https://www.youtube.com/watch?v=7QY4F0a-7-4'
    },

    /* ====== TANGO ====== */
    {
        name: 'Closed Promenade - Tango',
        color: '#cd5c5c',
        description: 'Podstawowy krok promenady w tangu, kończony zamknięciem w pozycję taneczną. W przeciwieństwie do walców, w tangu głowy są zwrócone w lewo (partner) i w prawo (partnerka), a ruch jest bardziej staccato (ostry, wyraźny). Ciężar ciała jest niżej, a kolana bardziej ugięte dla charakterystycznego "kociego" chodu.',
        videoLink: 'https://www.youtube.com/watch?v=8QY4F0a-7-4'
    },
    {
        name: 'Progressive Link - Tango',
        color: '#f4a460',
        description: 'Proste, bezpośrednie przejście z pozycji zamkniętej do pozycji promenady (PP). Partner inicjuje ruch przez lekkie otwarcie swojej lewej i prawej strony ciała (contra body movement), prowadząc partnerkę do ruchu w przód i w bok. Jest to jedna z najważniejszych figur łączących w tangu.',
        videoLink: 'https://www.youtube.com/watch?v=9QY4F0a-7-4'
    },
    {
        name: 'Promenade Link to R - Tango',
        color: '#2e8b57',
        description: 'Szybkie przejście z pozycji promenady (PP) do pozycji zamkniętej z obrotem w prawo. Partner prowadzi partnerkę do zamknięcia przed sobą, używając kontrakcji ciała i ramion. Często używane jako nagła zmiana kierunku lub po figurach takich jak Open Reverse Turn.',
        videoLink: 'https://www.youtube.com/watch?v=0QY4F0a-7-4'
    },
    {
        name: 'Outside Swivel – Metoda 1 - Tango',
        color: '#20b2aa',
        description: 'Dynamiczny obrót (swivel) partnerki na zewnątrz od partnera, wykonywany na podeszwie stopy. Partner daje wyraźny sygnał ramieniem i dłonią, aby poprowadzić partnerkę do szybkiego obrotu w prawo, często w rytmie "quick". Kończy się w pozycji promenady lub z partnerką z przodu partnera. Nadaje charakterystyczny, ostry akcent.',
        videoLink: 'https://www.youtube.com/watch?v=1QY4F0a-7-4'
    },
    {
        name: 'Basic Reverse Turn - Tango',
        color: '#ff6347',
        description: 'Podstawowy obrót w lewo (reverse) o 180 stopni, składający się z 6 kroków. Zaczyna się dla partnera lewą nogą w tył. Charakterystyczna dla tangu jest "snap" akcja głowy (szybkie odwrócenie i zatrzymanie) na krokach 3 i 4 oraz niskie, "przycięte" pozycje.',
        videoLink: 'https://www.youtube.com/watch?v=2QY4F0a-7-4'
    },
    {
        name: 'Mini Five Step - Tango',
        color: '#4682b4',
        description: 'Kompaktowa, pięciokrokowa sekwencja wykonywana w miejscu lub z niewielkim ruchem, często w rytmie "slow, quick, quick, slow, slow". Zawiera obrót i często kończy się ostrą, wyprostowaną pozycją (check). Popularna w sekwencjach "amerykańskich" i stylu show.',
        videoLink: 'https://www.youtube.com/watch?v=3QY4F0a-7-4'
    },
    {
        name: 'Fallaway Reverse Slip Pivot - Tango',
        color: '#32cd32',
        description: 'Zaawansowana kombinacja. "Fallaway" to ruch obojga partnerów do tyłu w pozycji promenady. "Reverse" wskazuje na obrót w lewo. "Slip Pivot" to specyficzny, ślizgający się obrót na pięcie (dla partnera) lub podeszwie (dla partnerki), który pozwala na gładką i szybką zmianę kierunku i pozycji, często kończąc tyłem do kierunku tańca.',
        videoLink: 'https://www.youtube.com/watch?v=4QY4F0a-7-4'
    },
    {
        name: 'Fallaway Four Step - Tango',
        color: '#ff4500',
        description: 'Czterokrokowa sekwencja wykonywana w pozycji fallaway (oba osoby poruszają się do tyłu w PP). Charakteryzuje się mocnym ugięciem kolan i wyraźnymi, krótkimi krokami. Kończy się zazwyczaj ostrym zatrzymaniem (check) lub przejściem w inne figury, jak Oversway czy Back Corte.',
        videoLink: 'https://www.youtube.com/watch?v=5QY4F0a-7-4'
    },
    {
        name: 'Back Open Promenade - Tango',
        color: '#8a2be2',
        description: 'Figura, w której para, będąc w pozycji promenady, cofa się razem. Partner cofa się lewą nogą, a partnerka prawą, utrzymując kontakt biodrami i zachowując napiętą, wyprostowaną sylwetkę charakterystyczną dla tangu. Często poprzedza wejście do Oversway lub Drag.',
        videoLink: 'https://www.youtube.com/watch?v=6QY4F0a-7-4'
    },
    {
        name: 'Natural Twist Turn from PP - Tango',
        color: '#ff1493',
        description: 'Spektakularny, zaawansowany obrót w prawo, w którym partnerka wykonuje skrętne zawinięcie (twist) pod uniesioną ręką partnera, podczas gdy on prowadzi ją z pozycji promenady. Partner wykonuje jedynie niewielki obrót, skupiając się na precyzyjnym prowadzeniu partnerki, która kończy figurę często w rozwinięciu lub opadnięciu.',
        videoLink: 'https://www.youtube.com/watch?v=7QY4F0a-7-4'
    },

    /* ====== WALC WIEDEŃSKI ====== */
    {
        name: 'Natural Turn - Walc Wiedeński',
        color: '#ff8c00',
        description: 'Podstawowy obrót w prawo, ale wykonywany w szybszym tempie walca wiedeńskiego (około 180 BPM). Składa się z 6 kroków, ale ze względu na tempo, obrót jest szybszy, a kroki mniejsze i bardziej "sprężyste" (rise and fall jest mniej wyraźne niż w walcu angielskim). Ciężar ciała jest wyżej, a obroty są bardziej żywiołowe.',
        videoLink: 'https://www.youtube.com/watch?v=8QY4F0a-7-4'
    },
    {
        name: 'RF fwd Change Natural To Reverse - Walc Wiedeński',
        color: '#a52a2a',
        description: 'Figura zmiany kierunku obrotu z naturalnego (w prawo) na reverse (w lewo). Wykonywana przez partnera z prawą nogą w przód, z mocnym użyciem kontrakcji ciała (Contra Body Movement - CBM) do inicjacji nowego obrotu w lewą stronę. Jest kluczowa dla manewrowania na zatłoczonym parkiecie i zmiany linii tańca.',
        videoLink: 'https://www.youtube.com/watch?v=9QY4F0a-7-4'
    },
    {
        name: 'LF bwd Change Natural To Reverse - Walc Wiedeński',
        color: '#b22222',
        description: 'Zmiana kierunku obrotu wykonywana przez partnerkę. Gdy partner inicjuje zmianę na Reverse Turn, partnerka, cofając się lewą nogą, używa CBM, aby przygotować się do obrotu w lewo, podążając za prowadzeniem partnera. Wymaga delikatności i podatności ze strony partnerki.',
        videoLink: 'https://www.youtube.com/watch?v=0QY4F0a-7-4'
    },
    {
        name: 'Reverse Turn - Walc Wiedeński',
        color: '#d2691e',
        description: 'Podstawowy obrót w lewo (przeciwnie do ruchu wskazówek zegara) w walcu wiedeńskim. Zaczyna się dla partnera od kroku w tył lewą nogą. Ze względu na wysokie tempo, akcja feet closing (zamykania stóp) na krokach 2-3 i 5-6 jest bardzo wyraźna i dynamiczna, co napędza obrót.',
        videoLink: 'https://www.youtube.com/watch?v=1QY4F0a-7-4'
    },
    {
        name: 'RF bwd Change Reverse to Natural - Walc Wiedeński',
        color: '#cd5c5c',
        description: 'Figura zmiany kierunku obrotu z reverse (w lewo) na naturalny (w prawo). Wykonywana przez partnera z prawą nogą w tył. Wymaga precyzyjnego CBM i transferu ciężaru ciała, aby gładko wyhamować obrót w lewo i zainicjować nowy, w prawo, bez tracenia równowagi i rytmu.',
        videoLink: 'https://www.youtube.com/watch?v=2QY4F0a-7-4'
    },
    {
        name: 'LF fwd Change Reverse to Natural - Walc Wiedeński',
        color: '#f4a460',
        description: 'Zmiana kierunku obrotu wykonywana przez partnerkę. Gdy partner inicjuje zmianę na Natural Turn, partnerka, idąc do przodu lewą nogą, używa CBM, aby podążyć za nowym kierunkiem prowadzenia. Kroki są małe i szybkie, aby dostosować się do dynamicznej zmiany.',
        videoLink: 'https://www.youtube.com/watch?v=3QY4F0a-7-4'
    },

    /* ====== SLOW FOXTROT ====== */
    {
        name: 'Feather Step - Slow Foxtrot',
        color: '#2e8b57',
        description: 'Fundamentalny krok foxtrota, symbolizujący jego "lotny" charakter. Partner wykonuje krok do przodu prawą nogą (często po łuku lub linii ukośnej) z zewnątrz partnerki (Outside Partner), z wyciągnięciem ciała w kierunku ruchu, co tworzy wrażenie "puszczania" i "łapania" partnerki. Krok jest niezwykle płynny i ciągły.',
        videoLink: 'https://www.youtube.com/watch?v=4QY4F0a-7-4'
    },
    {
        name: 'Reverse Turn - Slow Foxtrot',
        color: '#20b2aa',
        description: 'Obrót w lewo, składający się z 4 kroków (S Q Q S). Zaczyna się dla partnera tyłem do kierunku tańca (krok lewą nogą w tył). Na trzecim kroku (Quick) para wchodzi w pozycję promenady (PP), a czwartym krokiem (Slow) partner wykonuje Feather Finish, utrzymując nieprzerwany, ślizgający się ruch.',
        videoLink: 'https://www.youtube.com/watch?v=5QY4F0a-7-4'
    },
    {
        name: 'Three Step - Slow Foxtrot',
        color: '#ff6347',
        description: 'Trzy progresywne kroki do przodu (dla partnera: prawa, lewa, prawa), często używane jako przejście lub przygotowanie do innych figur. Ta prosta sekwencja jest ćwiczona dla doskonalenia płynności, utrzymania rytmu i idealnego transferu ciężaru ciała, co jest kluczowe dla charakteru foxtrota.',
        videoLink: 'https://www.youtube.com/watch?v=6QY4F0a-7-4'
    },
    {
        name: 'Weave from PP - Slow Foxtrot',
        color: '#4682b4',
        description: 'Skrętne przejście wykonywane z pozycji promenady. Para wykonuje serię skrętów i kroków bocznych, tworząc "splot" na parkiecie. Figura wymaga dobrej komunikacji, aby utrzymać synchronizację w pozycji promenady podczas obrotów.',
        videoLink: 'https://www.youtube.com/watch?v=7QY4F0a-7-4'
    },
    {
        name: 'Feather Finish - Slow Foxtrot',
        color: '#32cd32',
        description: 'Kończący krok feather, który często następuje po obrocie reverse. Partner kończy w pozycji outside partner (OP), gotowy do wykonania kolejnego feather step lub innej figury. Charakteryzuje się eleganckim wyciągnięciem ciała i przeniesieniem ciężaru na piętę, a następnie palce.',
        videoLink: 'https://www.youtube.com/watch?v=8QY4F0a-7-4'
    },
    {
        name: 'Natural Twist Turn with Impetus to PP - Slow Foxtrot',
        color: '#ff4500',
        description: 'Zaawansowana kombinacja obrotu twist i impetus. Partner prowadzi partnerkę do obrotu w prawo z jednoczesnym pivotem, kończąc w pozycji promenady. Wymaga precyzyjnego prowadzenia i doskonałej równowagi, especially from the lady who executes a twist under her own axis.',
        videoLink: 'https://www.youtube.com/watch?v=9QY4F0a-7-4'
    },
    {
        name: 'Impetus - Slow Foxtrot',
        color: '#8a2be2',
        description: 'Figura obracająca z charakterystycznym pivotem partnera na prawej nodze, podczas gdy partnerka jest prowadzona do obrotu wokół niego. Często używana jako wejście do pozycji promenady lub jako część bardziej złożonej sekwencji, jak Impetus Turn.',
        videoLink: 'https://www.youtube.com/watch?v=0QY4F0a-7-4'
    },
    {
        name: 'Hover Cross - Slow Foxtrot',
        color: '#ff1493',
        description: 'Figura "hover" (zawieszenie) zakończona skrzyżowaniem nóg. Para unosi się niemal w miejscu, tworząc wrażenie zawieszenia w powietrzu, po czym partner krzyżuje nogi (zwykle lewa nad prawą), a partnerka wykonuje odpowiedni krok boczny. Wymaga kontrolowanego opadnięcia i smooth weight transfer.',
        videoLink: 'https://www.youtube.com/watch?v=1QY4F0a-7-4'
    },
    {
        name: 'Top Spin - Slow Foxtrot',
        color: '#ff8c00',
        description: 'Dynamiczny, szybki obrót (spin) wykonywany przez partnerkę pod prowadzeniem partnera. Partnerka obraca się o 360 stopni lub więcej na palcach (ball of the foot), podczas gdy partner stabilizuje figurę i przygotowuje się do przyjęcia partnerki z powrotem. Często używany jako akcent lub finał.',
        videoLink: 'https://www.youtube.com/watch?v=2QY4F0a-7-4'
    },
    {
        name: 'Reverse Weave - Slow Foxtrot',
        color: '#a52a2a',
        description: 'Skrętne przejście w przeciwnym kierunku (w lewo), analogiczne do Basic Weave but in reverse. Seria obrotów i kroków prowadzi parę w linii ukośnej, ale z rotacją w lewo. Sylwetka pozostaje zamknięta, a kroki są płynne, though with a different dynamic due to the reverse rotation.',
        videoLink: 'https://www.youtube.com/watch?v=3QY4F0a-7-4'
    },

    /* ====== QUICKSTEP ====== */
    {
        name: 'Progressive Chasse to L - Quickstep',
        color: '#b22222',
        description: 'Postępowy chasse w lewo, składający się z kroku bocznego i przyciągnięcia (side-close-side). Ta podstawowa figura quickstepa charakteryzuje się lekkością, sprężystością i ruchem progresywnym w kierunku tańca. Często używana do przemieszczania się po linii tańca lub jako przygotowanie do obrotów.',
        videoLink: 'https://www.youtube.com/watch?v=4QY4F0a-7-4'
    },
    {
        name: 'Fwd Lockstep - Quickstep',
        color: '#d2691e',
        description: 'Krok zamykający do przodu, w którym noga wykroczna krzyżuje się przed nogą zakroczną (dla partnera: prawa noga krzyżuje przed lewą w ruchu do przodu). Tworzy to charakterystyczną "zamek" pozycję, która pozwala na kontrolowane wejście w obrót lub zmianę kierunku. Ważne jest utrzymanie rise and fall.',
        videoLink: 'https://www.youtube.com/watch?v=5QY4F0a-7-4'
    },
    {
        name: 'Open Reverse Turn - Quickstep',
        color: '#cd5c5c',
        description: 'Otwarty obrót w lewo, w którym para kończy w pozycji otwartej (partners facing each other but not in closed position) or in promenade. Często używany do zmiany kierunku i dodania dynamiki. Partner inicjuje obrót CBM na pierwszym kroku (back with left foot).',
        videoLink: 'https://www.youtube.com/watch?v=6QY4F0a-7-4'
    },
    {
        name: 'Open Natural Turn - Quickstep',
        color: '#f4a460',
        description: 'Otwarty obrót w prawo, podobny do Open Reverse Turn but with natural rotation. Kończy się w pozycji otwartej lub promenady, gotowy do kontynuowania progresji w nowym kierunku. Charakteryzuje się szerokim, ale kontrolowanym, obrotem.',
        videoLink: 'https://www.youtube.com/watch?v=7QY4F0a-7-4'
    },
    {
        name: 'Running Finish - Quickstep',
        color: '#2e8b57',
        description: 'Szybkie, biegnięte zakończenie figury, often used after a spin or turn to regain balance and momentum. Składa się z trzech szybkich kroków (QQS), które pozwalają parze na dynamiczne wyjście z obrotu i przygotowanie do następnej sekwencji.',
        videoLink: 'https://www.youtube.com/watch?v=8QY4F0a-7-4'
    },
    {
        name: 'Tipple Chasse to L - Quickstep',
        color: '#20b2aa',
        description: 'Podwójne chasse w lewo z charakterystycznym "tipple" action (unoszenie się na palcach). Ta szybsza i bardziej energiczna wersja chasse często obejmuje obrót i jest używana do pokonywania większych odległości na parkiecie. Wymaga dobrej koordynacji i timing.',
        videoLink: 'https://www.youtube.com/watch?v=9QY4F0a-7-4'
    },
    {
        name: 'Four Quick Run - Quickstep',
        color: '#ff6347',
        description: 'Cztery szybkie kroki progresywne do przodu (dla partnera: prawa, lewa, prawa, lewa), wykonywane w rytmie "quick, quick, quick, quick". Służy do przyspieszenia tempa i dodania żywiołowości. Kroki są lekkie i sprężyste, with body rise on the runs.',
        videoLink: 'https://www.youtube.com/watch?v=0QY4F0a-7-4'
    },
    {
        name: 'Running Natural Turn - Quickstep',
        color: '#4682b4',
        description: 'Szybki obrót naturalny w quickstepie, wykonywany z większą prędkością i mniejszym obrotem niż standardowy Natural Turn. Często używany w rogach lub do szybkiej zmiany kierunku. Partner może użyć sway to control the momentum.',
        videoLink: 'https://www.youtube.com/watch?v=1QY4F0a-7-4'
    },
    {
        name: 'Fish Tail - Quickstep',
        color: '#32cd32',
        description: 'Charakterystyczne rozwinięcie z ruchem przypominającym poruszanie się ogona ryby. Partner wykonuje serię kroków w miejscu lub z niewielkim ruchem, z nogami krzyżującymi się na zmianę, podczas gdy partnerka obraca się wokół niego. Tworzy to efekt wizualny podobny do machania ogonem. Wymaga dobrej stabilności core u partnera i podatności u partnerki.',
        videoLink: 'https://www.youtube.com/watch?v=2QY4F0a-7-4'
    },
    {
        name: 'Running Cross Chasse - Quickstep',
        color: '#ff4500',
        description: 'Dynamiczna, przyspieszona wersja Cross Chasse, w której para nie zamyka stóp w klasycznym chassé, ale kontynuuje ruch do przodu ("running"). Składa się z 4 kroków (SQQS lub SSQQ). Partner zaczyna od kroku prawej nogi w przód w CBMP i Outside Partner, następnie lewa noga w przód, potem prawa noga po skosie do przodu, a kończy lewą nogą w przód z prowadzeniem lewym ramieniem. Partnerka wykonuje ruchy lustrzane. Figura charakteryzuje się silnym sway (wychyleniem ciała) i utrzymaniem rise (unoszenia) przez większość sekwencji. Często używana do szybkiego przemieszczania się po linii tańca, zwłaszcza w rogach parkietu. Może być zakończona wejściem w pozycję promenady (Running Cross Chasse to PP).',
        videoLink: 'https://www.youtube.com/watch?v=3QY4F0a-7-4'
    }
];

  /* ====== HELPERS ====== */
  let recentFigures = [];
  let currentTab = 'recent';

  function ensureSvgSize(){ svg.style.height = Math.round(svg.clientWidth * 2 / 3) + 'px'; }
  function svgCoords(x, y){ const r = svg.getBoundingClientRect(); return { x: x - r.left, y: y - r.top }; }
  function lerp(a, b, t){ return a + (b - a) * t; }
  function sanitizePoint(p){
    return {  x: p.x, y: p.y, name: p.name||'', lead: p.lead||'', follow: p.follow||'', both: p.both||'', link: p.link||'',
      bend: Number(p.bend||0), bendPos: Number(p.bendPos ?? 50), color: p.color||'#7dd3fc', description: p.description||'' };
  }
async function loadCustomFigures() {
  try {
    const res = await fetch('/customFigures');
    const data = await res.json();
    customFigures = Array.isArray(data) ? data : [];
    updateFigureList();
  } catch(err) {
    console.error(err);
    customFigures = [];
  }
}

async function saveFigureToCustom(figure) {
  try {
    const res = await fetch('/customFigures', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(figure)
    });
    const result = await res.json();
    if(!result.ok) {
      alert('Nie udało się zapisać figury do Własnych');
    } else {
      // 🔄 odświeżenie listy własnych figur po zapisaniu
      await loadCustomFigures();
      updateFigureList();  // zakładka custom musi korzystać z customFigures
    }
  } catch(err) { console.error(err); }
}



  /* ====== RENDER ====== */
  function render(){
    ensureSvgSize();
    while(svg.firstChild) svg.removeChild(svg.firstChild);

    // Grid
    const g = document.createElementNS('http://www.w3.org/2000/svg','g'); g.setAttribute('class','grid');
    for(let x=0; x<svg.clientWidth; x+=50){ const l = document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',x); l.setAttribute('y1',0); l.setAttribute('x2',x); l.setAttribute('y2',svg.clientHeight); g.appendChild(l);}
    for(let y=0; y<svg.clientHeight; y+=50){ const l = document.createElementNS('http://www.w3.org/2000/svg','line'); l.setAttribute('x1',0); l.setAttribute('y1',y); l.setAttribute('x2',svg.clientWidth); l.setAttribute('y2',y); g.appendChild(l);}
    svg.appendChild(g);
  // ====== DANCE FLOOR (2:1) i środkowa linia (środkowa 1/3 szerokości) ======
  (function drawFloor() {
    const padding = 20; // wewnętrzny margines od krawędzi SVG w px
    const availableW = svg.clientWidth - padding * 2;
    const availableH = svg.clientHeight - padding * 2;

    // target aspect ratio 2:1 (width:height)
    let floorW = availableW;
    let floorH = Math.round(floorW / 2);
    if (floorH > availableH) {
      floorH = availableH;
      floorW = Math.round(floorH * 2);
    }

    // pozycjonowanie centrum
    const floorX = Math.round((svg.clientWidth - floorW) / 2);
    const floorY = Math.round((svg.clientHeight - floorH) / 2);

    // prostokąt parkietu
    const floorRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    floorRect.setAttribute('x', floorX);
    floorRect.setAttribute('y', floorY);
    floorRect.setAttribute('width', floorW);
    floorRect.setAttribute('height', floorH);
    floorRect.setAttribute('class', 'dance-floor');
    svg.appendChild(floorRect);

    // linia środkowa – dwa odcinki od środka parkietu
const centerX = floorX + Math.round(floorW / 2); // środek parkietu w poziomie
const centerY = floorY + Math.round(floorH / 2); // środek parkietu w pionie

// LEWY ODCINEK
const leftLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

// początek linii (x1) – przesunięty o 1/3 szerokości w lewo od środka
// 👉 TA linijka decyduje, jak DALEKO linia sięga od środka
leftLine.setAttribute("x1", centerX - Math.round(floorW / 3.5));
leftLine.setAttribute("y1", centerY);

// koniec linii (x2) – środek parkietu
// 👉 długość = różnica między x1 a x2
leftLine.setAttribute("x2", centerX);
leftLine.setAttribute("y2", centerY);

leftLine.setAttribute("stroke", "#38bdf8");         // kolor
leftLine.setAttribute("stroke-width", "2");        // grubość
leftLine.setAttribute("stroke-dasharray", "6,4");  // kreski (6px) i przerwy (4px)
stageSvg.appendChild(leftLine);

// PRAWY ODCINEK
const rightLine = document.createElementNS("http://www.w3.org/2000/svg", "line");

// początek linii w środku
rightLine.setAttribute("x1", centerX);
rightLine.setAttribute("y1", centerY);

// koniec linii (x2) – przesunięty o 1/3 szerokości w prawo
// 👉 TA linijka też kontroluje długość
rightLine.setAttribute("x2", centerX + Math.round(floorW / 3.5));
rightLine.setAttribute("y2", centerY);

rightLine.setAttribute("stroke", "#38bdf8");
rightLine.setAttribute("stroke-width", "2");
rightLine.setAttribute("stroke-dasharray", "6,4");
stageSvg.appendChild(rightLine);

  })();

    // Paths
    for(let i=0; i<state.points.length; i++){
      const p1=state.points[i]; const p2=state.points[(i+1)%state.points.length];
      if(i===state.points.length-1 && !state.closed) break;

      const pathEl = document.createElementNS('http://www.w3.org/2000/svg','path');
      const bend=p1.bend||0; const bendPos=p1.bendPos||50;
      const dx=p2.x-p1.x, dy=p2.y-p1.y;
      const cx=lerp(p1.x,p2.x,bendPos/100)-dy/200*bend;
      const cy=lerp(p1.y,p2.y,bendPos/100)+dx/200*bend;
      pathEl.setAttribute('d',`M${p1.x},${p1.y} Q${cx},${cy} ${p2.x},${p2.y}`);
      pathEl.setAttribute('class','path');
      pathEl.addEventListener('click', e=>{
        if(!(state.edit && addPointsEnabled)) return;
        const rect=svg.getBoundingClientRect();
        const x=e.clientX-rect.left, y=e.clientY-rect.top;
        state.points.splice(i+1,0,sanitizePoint({x,y}));
        state.selected=i+1; render(); e.stopPropagation();
      });
      svg.appendChild(pathEl);

      if(state.selected===i){
        const h=document.createElementNS('http://www.w3.org/2000/svg','circle');
        h.setAttribute('cx',cx); h.setAttribute('cy',cy); h.setAttribute('r',6); h.setAttribute('class','helper-dot');
        svg.appendChild(h);
      }
    }

    // Points
    state.points.forEach((pt,i)=>{
      const nodeTag=(i===0)?'polygon':'circle';
      const c=document.createElementNS('http://www.w3.org/2000/svg',nodeTag);
      if(i===0){
        const size=14; const points=`${pt.x},${pt.y-size/2} ${pt.x-size/2},${pt.y+size/2} ${pt.x+size/2},${pt.y+size/2}`;
        c.setAttribute('points',points); c.setAttribute('class','first-dot'+(state.selected===i?' sel':'')); 
      }else{ c.setAttribute('cx',pt.x); c.setAttribute('cy',pt.y); c.setAttribute('r',10); c.setAttribute('class','dot'+(state.selected===i?' sel':'')); }
      c.dataset.index=i; c.style.fill=pt.color; svg.appendChild(c);

      const t=document.createElementNS('http://www.w3.org/2000/svg','text'); 
      t.setAttribute('x',pt.x+12); t.setAttribute('y',pt.y-12); t.setAttribute('class','label'); t.textContent=pt.name||(i+1);
      svg.appendChild(t);
    });

//Wyrównywanie linii

    // Panel detali
    if(state.selected>=0){
      const p=state.points[state.selected];
      selIndex.value=state.selected+1; selName.value=p.name||''; selLead.value=p.lead||''; selFollow.value=p.follow||''; selBoth.value=p.both||''; selLink.value=p.link||''; selColor.value=p.color; bendRange.value=p.bend||0; bendPosRange.value=p.bendPos||50;
    }else{
      selIndex.value=selName.value=selLead.value=selFollow.value=selBoth.value=selLink.value=''; selColor.value='#7dd3fc'; bendRange.value=0; bendPosRange.value=50;
    }
    danceNameEl.textContent=state.name||'(bez nazwy)';
  }

  /* ====== MUTATIONS ====== */
  function addPointAt(x,y){
    const pt = sanitizePoint({x,y});
    state.points.push(pt);
    state.selected = state.points.length-1;
    render();
  }

  /* ====== POINTER EVENTS ====== */
  svg.addEventListener('pointerdown', e=>{
    const t=e.target.tagName;
    if(t==='circle'||t==='polygon'){ const idx=parseInt(e.target.dataset.index,10); state.selected=idx; 
      render();
      if(state.edit && dragEnabled) dragging=idx; }
    else if(t==='svg' && state.edit && addPointsEnabled){ const p=svgCoords(e.clientX,e.clientY); addPointAt(p.x,p.y); }
  });
  svg.addEventListener('pointermove', e=>{ if(dragging==null || !(state.edit && dragEnabled)) return; const p=svgCoords(e.clientX,e.clientY); const pt=state.points[dragging]; pt.x=p.x; pt.y=p.y; render(); });
  svg.addEventListener('pointerup', ()=>{ dragging=null; });

  /* ====== PANEL HANDLERS ====== */
  [selName, selLead, selFollow, selBoth, selLink].forEach(el=>el.addEventListener('input', ()=>{
    if(state.selected>=0){
      const p=state.points[state.selected];
      p.name=selName.value; p.lead=selLead.value; p.follow=selFollow.value; p.both=selBoth.value; p.link=selLink.value;
      render();
    }
  }));
  selColor.addEventListener('input', ()=>{ if(state.selected>=0){ state.points[state.selected].color=selColor.value; render(); } });
  bendRange.addEventListener('input', ()=>{ if(state.selected>=0){ state.points[state.selected].bend=Number(bendRange.value); render(); } });
  bendPosRange.addEventListener('input', ()=>{ if(state.selected>=0){ state.points[state.selected].bendPos=Number(bendPosRange.value); render(); } });

  resetBendBtn.addEventListener('click', ()=>{ if(state.selected>=0){ state.points[state.selected].bend=0; bendRange.value=0; render(); } });
  resetBendPosBtn.addEventListener('click', ()=>{ if(state.selected>=0){ state.points[state.selected].bendPos=50; bendPosRange.value=50; render(); } });

  updatePointBtn.onclick = () => {
  if(state.selected < 0) return;
 
  const p = state.points[state.selected];
  if(p.name && !figures.find(f => f.name === p.name)) {
    figures.push({ 
      name: p.name, color: p.color, description: p.description||'', 
      lead: p.lead, follow: p.follow, both: p.both, link: p.link 
    });
  }
  recentFigures = [p.name, ...recentFigures.filter(n => n !== p.name)].slice(0, 10);
  render(); 
  updateFigureList();

  
  // 🔥 ZAPIS DO CUSTOM FIGURES
  
  saveFigureToCustom({ 
    name: p.name, color: p.color, description: p.description||'', 
    lead: p.lead, follow: p.follow, both: p.both, link: p.link 
  });
};

  /* ====== TOOLBAR ====== */
  closeDescBtn.onclick = () => { descModal.style.display = 'none'; };

  newBtn.onclick = ()=>{ state={name:'Nowy układ',points:[],closed:false,edit:true,selected:-1}; editBtn.classList.add('toggled'); toggleAddBtn.textContent='Dodawanie punktów: ON'; addPointsEnabled=true; dragEnabled=true; toggleDragBtn.classList.add('toggled'); render(); };
  clearBtn.onclick = ()=>{ if(confirm('Wyczyścić bieżący układ?')){ state.points=[]; state.selected=-1; render(); } };
  closeBtn.onclick = ()=>{ state.closed=!state.closed; closeBtn.textContent=state.closed?'Otwórz ścieżkę':'Zamknij ścieżkę'; render(); };
  editBtn.onclick = ()=>{ state.edit=!state.edit; editBtn.classList.toggle('toggled',state.edit); };
  toggleAddBtn.onclick = ()=>{ addPointsEnabled=!addPointsEnabled; toggleAddBtn.textContent='Dodawanie punktów: '+(addPointsEnabled?'ON':'OFF'); };
  toggleDragBtn.onclick = ()=>{ dragEnabled=!dragEnabled; toggleDragBtn.classList.toggle('toggled',dragEnabled); toggleDragBtn.textContent='Przesuwanie punktów: '+(dragEnabled?'ON':'OFF'); };
  deleteSelectedBtn.onclick = ()=>{ if(state.selected<0) return; if(confirm('Na pewno chcesz usunąć wybrany punkt?')){ state.points.splice(state.selected,1); state.selected=-1; render(); } };

  /* ====== FIGURE LIST ====== */
  let figureSearchTerm = ''; let figureSortAsc = true;
  function updateFigureList() {
  let listData;
  if(currentTab === 'recent') {
    listData = recentFigures.map(name => figures.find(f => f.name === name)).filter(Boolean);
  } else if(currentTab === 'custom') {
    listData = customFigures.slice();
  } else {
    listData = figures.slice();
  }

  if(figureSearchTerm) {
    listData = listData.filter(f => f.name.toLowerCase().includes(figureSearchTerm));
  }

  listData.sort((a,b) => {
    if(a.name < b.name) return figureSortAsc ? -1 : 1;
    if(a.name > b.name) return figureSortAsc ? 1 : -1;
    return 0;
  });

  figureListEl.innerHTML = '';
  listData.forEach(f => {
    const li = document.createElement('li');
    li.className = 'item';
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.justifyContent = 'space-between';

    // nazwa i kolor
    const leftSpan = document.createElement('span');
    leftSpan.style.display = 'flex';
    leftSpan.style.alignItems = 'center';
    leftSpan.style.gap = '6px';
    leftSpan.innerHTML = `
      <span style="display:inline-block; width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${f.name}</span>
      <span class="badge" style="width:16px; height:16px; border-radius:50%; background:${f.color}; display:inline-block;"></span>
    `;
    leftSpan.style.cursor = 'pointer';
    leftSpan.onclick = () => {
      if(state.selected >= 0){
        Object.assign(state.points[state.selected], {
          name: f.name,
          color: f.color,
          description: f.description||'',
          lead: f.lead||'',
          follow: f.follow||'',
          both: f.both||'',
          link: f.link||''
        });
        render();
        updateFigureList();
      } else {
        alert('Wybierz punkt na parkiecie, aby zastosować figurę.');
      }
    };
    li.appendChild(leftSpan);

    // przyciski Edytuj / Usuń
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';

    const showDescBtn = document.createElement('button');
    showDescBtn.className = 'btn tiny';
    showDescBtn.textContent = 'Opis';
    showDescBtn.onclick = () => {
      descTitle.textContent = f.name;
      descContent.textContent = f.description || 'Brak opisu dla tej figury.';
      descModal.style.display = 'flex';
    };
    actionsDiv.appendChild(showDescBtn);

    const editBtn = document.createElement('button');
    editBtn.className = 'btn tiny';
    editBtn.textContent = 'Edytuj';
    editBtn.onclick = (e) => {
      e.stopPropagation();
      if(state.selected >= 0){
        Object.assign(state.points[state.selected], {
          name: f.name,
          color: f.color,
          description: f.description || '',
          lead: f.lead || '',
          follow: f.follow || '',
          both: f.both || '',
          link: f.link || ''
        });
        render();
        updateFigureList();
      } else {
        alert('Wybierz punkt na parkiecie, aby zastosować figurę.');
      }
    };
    actionsDiv.appendChild(editBtn);

    const deleteBtn = document.createElement('button'); // <<< Poprawka: wcześniej brakowało definicji
    deleteBtn.className = 'btn tiny';
    deleteBtn.style.background = '#ef4444';
    deleteBtn.style.color = '#fff';
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      if (confirm(`Na pewno chcesz usunąć figurę "${f.name}"?`)) {
        if (currentTab === 'custom') {
          customFigures = customFigures.filter(c => c.name !== f.name);
          fetch('/customFigures/delete', {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({name:f.name})
          });
        }
        updateFigureList();
      }
    };
    actionsDiv.appendChild(deleteBtn);

    li.appendChild(actionsDiv);
    figureListEl.appendChild(li);
  });
}




  
  document.querySelectorAll('.tab').forEach(tab=>{ tab.onclick=()=>{ currentTab=tab.dataset.tab; document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t===tab)); updateFigureList(); }; });
  updateFigureList();

/* ====== LIBRARY MODAL ====== */
async function loadLibrary() {
  try {
    const res = await fetch('/library');
    const data = await res.json();
    library = Array.isArray(data) ? data : [];
    updateLibraryList();
  } catch (err) {
    console.error('Błąd wczytywania biblioteki:', err);
    library = [];
    updateLibraryList();
  }
}

function updateLibraryList() {
  libraryList.innerHTML = '';
  if (library.length === 0) {
    libraryEmpty.style.display = 'block';
    return;
  } else {
    libraryEmpty.style.display = 'none';
  }

  library.forEach((d, i) => {
    const div = document.createElement('div');
    div.className = 'lib-row';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.cursor = 'pointer';

    // kliknięcie w nazwę wczytuje układ
    const nameSpan = document.createElement('span');
    nameSpan.className = 'name';
    nameSpan.textContent = d.name;
    nameSpan.style.flex = '1';
    nameSpan.onclick = () => {
      state = JSON.parse(JSON.stringify(library[i]));
      render();
      libraryModal.style.display = 'none';
    };
    div.appendChild(nameSpan);

    // przycisk Usuń
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn tiny';
    deleteBtn.style.background = '#ef4444';
    deleteBtn.style.color = '#fff';
    deleteBtn.textContent = 'Usuń';
    deleteBtn.onclick = async (e) => {
      e.stopPropagation(); // kliknięcie nie wczytuje układu
      if (!confirm(`Na pewno chcesz usunąć układ "${d.name}" z biblioteki?`)) return;
      try {
        const res = await fetch('/library/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: d.name })
        });
        const result = await res.json();
        if (result.ok) {
          alert('Usunięto układ z biblioteki.');
          await loadLibrary();
        } else {
          alert('Błąd przy usuwaniu układu.');
        }
      } catch (err) {
        console.error(err);
        alert('Błąd przy usuwaniu układu.');
      }
    };
    div.appendChild(deleteBtn);

    libraryList.appendChild(div);
  });
}

// otwieranie i zamykanie modalu
openBtn.onclick = async () => { await loadLibrary(); libraryModal.style.display = 'flex'; };
closeLibBtn.onclick = () => { libraryModal.style.display = 'none'; };



  // zapis bieżącego układu
async function saveCurrentLibrary(e) {
  if (e) e.preventDefault();
  if (state.points.length === 0) return alert('Brak punktów do zapisania.');

  let name = state.name && state.name !== 'bez nazwy' ? state.name : '';
  name = prompt('Podaj nazwę układu:', name);
  if (!name) return;

  const copy = { ...state, name };

  // Sprawdzenie, czy już istnieje
  const existing = library.find(l => l.name === name);
  if (existing) {
    if (!confirm(`Układ "${name}" już istnieje. Nadpisać go?`)) return;
  }

  try {
    const res = await fetch('/library', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(copy)
    });
    const result = await res.json();
    if (result.ok) {
      alert(existing ? 'Układ został zaktualizowany.' : 'Zapisano układ w bibliotece.');
      state.name = name;
      danceNameEl.textContent = name;
      await loadLibrary();
    } else {
      alert('Błąd zapisu układu.');
    }
  } catch (err) {
    console.error('Błąd zapisu układu:', err);
    alert('Błąd zapisu układu.');
  }
}


  saveCurrentBtn.onclick = saveCurrentLibrary;
  saveBtn.onclick = saveCurrentLibrary;

  copyShareBtn.onclick = ()=>{ navigator.clipboard.writeText(JSON.stringify(state)); alert('Skopiowano stan do schowka.'); };

  /* ====== SEARCH & SORT ====== */
  const searchFigureEl = document.getElementById('searchFigure');
  const sortFigureBtn = document.getElementById('sortFigureBtn');
  searchFigureEl.addEventListener('input', ()=>{ figureSearchTerm=searchFigureEl.value.toLowerCase(); updateFigureList(); });
  sortFigureBtn.addEventListener('click', ()=>{ figureSortAsc=!figureSortAsc; sortFigureBtn.textContent=figureSortAsc?'Sort A→Z':'Sort Z→A'; updateFigureList(); });

  /* ====== INIT ====== */
  window.addEventListener('resize', render);
  await loadCustomFigures();
  render();

});
