function bkEsc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
var RR_LIBRARY = [
  {title:"A Vapor Breath (2000s Alternative Metal)", artist:"RRN", src:"music/A Vapor Breath.mp3", genre:"Christian 2000s Alternative Metal"},
  {title:"A Whisper from Hannah (Southern Blues Rock)", artist:"RRN", src:"music/A Whisper From Hannah Country Rock.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Abide in You (Dance)", artist:"RRN", src:"music/ABIDE IN YOU— DANCE FLOOR ANTHEM.mp3", genre:"Christian Dance"},
  {title:"Abide in You (Worship Rock)", artist:"RRN", src:"music/ABIDE IN YOU— Post-Grunge.mp3", genre:"Worship Rock"},
  {title:"Alabaster Box (Teaching)", artist:"RRN Teaching", src:"music/Alabaster_Box.mp3", genre:"Biblical Teaching"},
  {title:"Alabaster Tears (Outlaw Country)", artist:"RRN", src:"music/Alabaster Tears (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Among the Tombs (Outlaw Country)", artist:"RRN", src:"music/Among the Tombs (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Backside of the Desert (Teaching)", artist:"RRN Teaching", src:"music/Backside_Desert.mp3", genre:"Biblical Teaching"},
  {title:"Beauty for Ashes (Southern Blues Rock)", artist:"RRN", src:"music/Beauty for Ashes (1).mp3", genre:"Christian Southern Blues Rock"},
  {title:"Beauty Holiness (Worship)", artist:"RRN", src:"music/Beauty Holiness Radio.mp3", genre:"Contemporary Worship"},
  {title:"Beauty Holiness: Spanish Guitar Version (Southern Blues Rock)", artist:"RRN", src:"music/Beauty Holiness Spanish Guitar (1).mp3", genre:"Christian Southern Blues Rock"},
  {title:"Beyond the Shadows (Pop)", artist:"RRN", src:"music/Beyond the Shadows.mp3", genre:"Christian Pop"},
  {title:"Bless Your Name (Bluegrass)", artist:"RRN", src:"music/Bless Your Name (Bluegrass).mp3", genre:"Christian Bluegrass", isNew:true},
  {title:"Blessed & a Mess (Country Rap Bounce Mix)", artist:"RRN", src:"music/Blessed & a Mess Bounce Drop Country Rap (1).mp3", genre:"Christian Bounce Drop"},
  {title:"Bow Before Your Throne (K-Pop)", artist:"RRN", src:"music/Bow Before Your Thone (K - Pop).mp3", genre:"Christian K-Pop", isNew:true},
  {title:"Break the Silence (Praise & Worship)", artist:"RRN", src:"music/Break the Silence”.mp3", genre:"Praise & Worship"},
  {title:"Breath on Glass (Hip-Hop)", artist:"RRN", src:"music/Breath on Glass (1).mp3", genre:"Christian Hip-Hop"},
  {title:"Broken but Yours (Worship)", artist:"RRN", src:"music/Broken but Yours (Worship).mp3", genre:"Contemporary Worship"},
  {title:"Broken by Grace (Country)", artist:"RRN", src:"music/Broken By Grace (Country).mp3", genre:"Christian Country", isNew:true},
  {title:"Broken Chains (Psychedelic Christian Rock)", artist:"RRN", src:"music/Broken Chains Psychedelic Rock Version (1).mp3", genre:"Psychedelic Christian Rock"},
  {title:"Brook Code (Teaching)", artist:"RRN Teaching", src:"music/Brook_Code.mp3", genre:"Biblical Teaching"},
  {title:"Called by Name (I Am Yours) (EDM)", artist:"RRN", src:"music/CALLED BY NAME (I AM YOURS) (1).mp3", genre:"Christian EDM"},
  {title:"Called from the Low Places (Southern Blues Rock)", artist:"RRN", src:"music/Called From the Low Places (1).mp3", genre:"Christian Southern Blues Rock"},
  {title:"Chaos vs. Calling (EDM)", artist:"RRN", src:"music/CHAOS VS CALLING (1).mp3", genre:"Christian EDM"},
  {title:"Church N Chicken (Country Rap Bounce Mix)", artist:"RRN", src:"music/Church N Chicken Bounce Drop Country Rap.mp3", genre:"Christian Bounce Drop"},
  {title:"Clock Won't Let Go (Country Rap Bounce Mix)", artist:"RRN", src:"music/Clock Won’t Let Go Bounce Drop Country Rap.mp3", genre:"Christian Bounce Drop"},
  {title:"Closer Than My Breath (Pop)", artist:"RRN", src:"music/Closer Than My Breath Pop.mp3", genre:"Christian Pop"},
  {title:"Clothed in Your Glory (R&B)", artist:"RRN", src:"music/Clothed in Your Glory (R&B).mp3", genre:"Christian R&B", isNew:true},
  {title:"Come Alive (Chains Fall Down) (Pop)", artist:"RRN", src:"music/Come Alive (Chains Fall Down) Radio.mp3", genre:"Christian Pop"},
  {title:"Come Alive (Praise & Worship)", artist:"RRN", src:"music/Come Alive (Chains Fall Down).mp3", genre:"Praise & Worship"},
  {title:"Come Alive (Chains Fall Down) (Radio Edit)", artist:"RRN", src:"music/Come Alive (Chains Fall Down) Radio (1).mp3", genre:"Christian Pop"},
  {title:"Consuming Fire (Country)", artist:"RRN", src:"music/Consuming Fire Country.mp3", genre:"Christian Country"},
  {title:"Consuming Fire (Pop)", artist:"RRN", src:"music/Consuming Fire (1).mp3", genre:"Christian Pop"},
  {title:"Consuming Fire (Blues Jazz Version)", artist:"RRN", src:"music/Consuming Fire Jazz.mp3", genre:"Christian Blues-Jazz"},
  {title:"Crown of Thorns, Hands of Grace (Worship Rock)", artist:"RRN", src:"music/CROWN OF THORNS, HANDS OF GRACE— Post-Grunge.mp3", genre:"Worship Rock"},
  {title:"Daughter Again (EDM)", artist:"RRN", src:"music/Daughter Again EDM (1).mp3", genre:"Christian EDM"},
  {title:"Daughter Again (Pop)", artist:"RRN", src:"music/Daughter Again Pop (1).mp3", genre:"Christian Pop"},
  {title:"Devil Under My Soles (Pop)", artist:"RRN", src:"music/Devil_Under_My_Soles.mp3", genre:"Christian Pop"},
  {title:"Divine Control (Trip-Hop)", artist:"RRN", src:"music/Divine-Control.mp3", genre:"Christian Trip-Hop"},
  {title:"Divine Control (EDM Version)", artist:"RRN", src:"music/Divine Controlt13.mp3", genre:"Christian EDM"},
  {title:"Do You Love Me? (Outlaw Country)", artist:"RRN", src:"music/Do You Love Me_  (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Don't You Cry Anymore (Pop)", artist:"RRN", src:"music/Don't You Cry Anymore (1).mp3", genre:"Christian Pop", isNew:true},
  {title:"Double Portion (Southern Blues Rock)", artist:"RRN", src:"music/Double Portion.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Double Portion (Radio Edit)", artist:"RRN", src:"music/Double Portion Radio (1).mp3", genre:"Christian Alternative R&B"},
  {title:"Faithfully (EDM)", artist:"RRN", src:"music/FAITHFULLYt8.mp3", genre:"Christian EDM"},
  {title:"Faithfully (Trip-Hop)", artist:"RRN", src:"music/FAITHFULLY.mp3", genre:"Christian Trip-Hop"},
  {title:"Fall on Us (Chillwave)", artist:"RRN", src:"music/Fall on Us Chill.mp3", genre:"Christian Chillwave"},
  {title:"Fall on Us (Outlaw Country)", artist:"RRN", src:"music/Fall on U s Outlaw Country (2).mp3", genre:"Christian Outlaw Country"},
  {title:"Fall on Us (Psychedelic Christian Rock)", artist:"RRN", src:"music/FallmOn Us.mp3", genre:"Psychedelic Christian Rock"},
  {title:"Fall on Us (Alternative R&B Radio Edit)", artist:"RRN", src:"music/Fall on Us Radio (1).mp3", genre:"Christian Alternative R&B"},
  {title:"Father's Steady Hands (Hip-Hop)", artist:"RRN", src:"music/Father’s Steady Hands.mp3", genre:"Christian Hip-Hop"},
  {title:"Fever (K-Pop)", artist:"RRN", src:"music/Fever.mp3", genre:"Christian K-Pop"},
  {title:"Fire in My Bones (Chillwave)", artist:"RRN", src:"music/Fire in My Bones Chill (1).mp3", genre:"Christian Chillwave"},
  {title:"Fire in My Bones (Trip-Hop)", artist:"RRN", src:"music/Fire in My Bones (1).mp3", genre:"Christian Trip-Hop"},
  {title:"Fire in My Bones (Radio Edit – K-Pop)", artist:"RRN", src:"music/Fire in My Bones Radio.mp3", genre:"Christian K-Pop"},
  {title:"Fire in My Bones (Radio Edit – Pop)", artist:"RRN", src:"music/Fire in My Bones Radio (1).mp3", genre:"Christian Pop"},
  {title:"Foot on His Neck (Southern Christian Rock)", artist:"RRN", src:"music/Foot on His Neck Country Rock (1).mp3", genre:"Southern Christian Rock"},
  {title:"Fragile Heart, Eternal Light (80's)", artist:"RRN", src:"music/FRAGILE HEART, ETERNAL LIGHTt6 (1).mp3", genre:"Christian 80's"},
  {title:"From Pit to Purpose (EDM)", artist:"RRN", src:"music/FROM PIT TO PURPOSE.mp3", genre:"Christian EDM"},
  {title:"From Pit to Purpose (Worship Rock)", artist:"RRN", src:"music/FROM PIT TO PURPOSEt7 (1).mp3", genre:"Worship Rock"},
  {title:"Give God Your Burden (Country)", artist:"RRN", src:"music/Give God Your Burden (Country).mp3", genre:"Christian Country", isNew:true},
  {title:"Go a Little Further (Testimony)", artist:"RRN", src:"music/Go a Little Further (1).mp3", genre:"Testimony Songs"},
  {title:"God's Glory Ends My Story (Country)", artist:"RRN", src:"music/God's Glory Ends My Story Modern country-pop.mp3", genre:"Christian Country"},
  {title:"God's Glory Ends My Story (Praise & Worship Ballad)", artist:"RRN", src:"music/God's Glory Ends My Story Gospel Soul Worship Ballad.mp3", genre:"Praise & Worship"},
  {title:"Grace Fever (K-Pop)", artist:"RRN", src:"music/Grace Fever.mp3", genre:"Christian K-Pop"},
  {title:"Grace in Cowboy Boots (Country)", artist:"RRN", src:"music/Grace in Cowboy Boots (Country).mp3", genre:"Christian Country", isNew:true},
  {title:"Grace Runs Deep (Like a River) (Psychedelic Christian Rock)", artist:"RRN", src:"music/“Grace Runs Deep (Like a River) Psychedelic Rock Version (1).mp3", genre:"Psychedelic Christian Rock"},
  {title:"Grace This Place (Country)", artist:"RRN", src:"music/Grace This Place Outlaw Country Rock.mp3", genre:"Christian Country"},
  {title:"Grandma Outdanced Me in Church (Bounce Drop)", artist:"RRN", src:"music/GRANDMA OUTDANCED ME IN CHURCH — Bounce Drop Country Rap,.mp3", genre:"Christian Bounce Drop"},
  {title:"Grandma Said Amen Country Rap (Bounce Drop)", artist:"RRN", src:"music/Grandma Said Amen Bounce Drop Country Rap.mp3", genre:"Christian Bounce Drop"},
  {title:"Grandpa Was a Preacher Man (Country)", artist:"RRN", src:"music/Granpa was a Preacher Man (1).mp3", genre:"Christian Country"},
  {title:"Grounded in Victory (2000s Alternative Metal)", artist:"RRN", src:"music/GROUNDED IN VICTORY— Post-Grunge.mp3", genre:"Christian 2000s Alternative Metal"},
  {title:"Grounded in Victory (Gospel Blues)", artist:"RRN", src:"music/GROUNDED IN VICTORY— Blues Rock.mp3", genre:"Gospel Blues"},
  {title:"Hair Down Glory (Stage Style)", artist:"RRN", src:"music/Hair Down Glory (1).mp3", genre:"Christian Stage Style"},
  {title:"Hallelujah in the Fire (Worship Rock)", artist:"RRN", src:"music/Hallelujah in the Fire Cowboy Outlaw Rock.mp3", genre:"Worship Rock"},
  {title:"Hallelujah Lamb Trance (EDM)", artist:"RRN", src:"music/Hallelujah Lamb Trance (1).mp3", genre:"Christian EDM"},
  {title:"Hannah Prayed (Teaching)", artist:"RRN Teaching", src:"music/Hannah_Prayed.mp3", genre:"Biblical Teaching"},
  {title:"Hard to See Lines (Pop)", artist:"RRN", src:"music/Hard-to-See Lines.mp3", genre:"Christian Pop"},
  {title:"He Is My Salvation (EDM)", artist:"RRN", src:"music/He Is My Salvation t4 (1).mp3", genre:"Christian EDM"},
  {title:"He Lifts the Lowly (Worship)", artist:"RRN", src:"music/He Lifts the Lowly.mp3", genre:"Christian EDM"},
  {title:"He Lifts the Lowly (Gospel Blues)", artist:"RRN", src:"music/He Lifts the Lowly (2).mp3", genre:"Gospel Blues"},
  {title:"He Lifts the Lowly (Worship)", artist:"RRN", src:"music/He Lifts the Lowly (1).mp3", genre:"Contemporary Worship"},
  {title:"He Still Calls My Name (Hip-Hop)", artist:"RRN", src:"music/He Still Calls My Name.mp3", genre:"Christian Hip-Hop"},
  {title:"He Still Calls My Name (Southern Christian Rock)", artist:"RRN", src:"music/He Still Calls My Name (1).mp3", genre:"Southern Christian Rock"},
  {title:"He Sustains Me Through the Storm (Southern Blues Rock)", artist:"RRN", src:"music/He Sustains Me Through the Storm.mp3", genre:"Christian Southern Blues Rock"},
  {title:"He Took My Place (Southern Christian Rock)", artist:"RRN", src:"music/HE TOOK MY PLACE.mp3", genre:"Southern Christian Rock"},
  {title:"He's Coming Back (EDM)", artist:"RRN", src:"music/Hes comming backt.mp3", genre:"Christian EDM"},
  {title:"Healed by the Hand (Dance)", artist:"RRN", src:"music/Healed by the Hand (Dance).mp3", genre:"Christian Dance", isNew:true},
  {title:"Hear My Cause, O Lord (Southern Blues Rock)", artist:"RRN", src:"music/Hear My Cause, O Lord.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Hear My Cause, O Lord (Southern Christian Rock)", artist:"RRN", src:"music/Hear My Cause, O Lord (1).mp3", genre:"Southern Christian Rock"},
  {title:"Heart of Glass, Hand of Grace (Dance)", artist:"RRN", src:"music/HEART OF GLASS, HAND OF GRACE (Dance).mp3", genre:"Christian Dance", isNew:true},
  {title:"Here Comes the Pain (EDM)", artist:"RRN", src:"music/Here-Comes-the-Pain.mp3", genre:"Christian EDM"},
  {title:"Here Comes the Paint (EDM)", artist:"RRN", src:"music/Here Comes the Paint17 (1).mp3", genre:"Christian EDM"},
  {title:"Hes Comming Back (EDM)", artist:"RRN", src:"music/Hes comming back.mp3", genre:"Christian EDM"},
  {title:"Hidden Glory (R&B)", artist:"RRN", src:"music/Hidden Glory R&B.mp3", genre:"Christian R&B"},
  {title:"Hidden in the Shadow of His Wings (LoFi)", artist:"RRN", src:"music/Hidden in the Shadow of His Wings (LoFi).mp3", genre:"Christian LoFi", isNew:true},
  {title:"His Mercy Runs Deep (R&B)", artist:"RRN", src:"music/His Mercy Runs Deep (R&B).mp3", genre:"Christian R&B", isNew:true},
  {title:"Holy Rest (80's)", artist:"RRN", src:"music/Holy Rest (1).mp3", genre:"Christian 80's"},
  {title:"Holy Rest (Alternative R&B)", artist:"RRN", src:"music/Holy Rest R&B JAZZ CHILL.mp3", genre:"Christian Alternative R&B"},
  {title:"Holy Rest (Freestyle) (80's)", artist:"RRN", src:"music/Holy Rest (Freestyle).mp3", genre:"Christian 80's"},
  {title:"Hope Over Despair (Worship)", artist:"RRN", src:"music/Hope Over Despair.mp3", genre:"Contemporary Worship"},
  {title:"I Almost Left My Coffee in the Pew (Bounce Drop)", artist:"RRN", src:"music/I Almost Left My Coffee in the Pew — Bounce Drop Country Rap,.mp3", genre:"Christian Bounce Drop"},
  {title:"I Am Barabbas (Outlaw Country)", artist:"RRN", src:"music/I Am Barabbas  (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"I Am Born Again (Alternative 2000s Rock)", artist:"RRN", src:"music/I am Born Again (Alt 2000s Rock).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"I Am the Bride (R&B)", artist:"RRN", src:"music/I am the bride.mp3", genre:"Christian R&B"},
  {title:"I Am Yours (Chillwave)", artist:"RRN", src:"music/I am Yours Chill.mp3", genre:"Christian Chillwave"},
  {title:"I Googled God (K-Pop)", artist:"RRN", src:"music/I Googled God (K - Pop).mp3", genre:"Christian K-Pop", isNew:true},
  {title:"I Quoted the Wrong Verse (It Was a Burger King Ad) (Bounce Drop)", artist:"RRN", src:"music/“I QUOTED THE WRONG VERSE (IT WAS A BURGER KING AD)— Bounce Drop Country Rap,.mp3", genre:"Christian Bounce Drop"},
  {title:"I Was Running (Gut Mercy Caught Me) (Chillwave)", artist:"RRN", src:"music/I Was Running (But Mercy Caught Me) Chill.mp3", genre:"Christian Chillwave"},
  {title:"I Will Walk on Water Remix (EDM)", artist:"RRN", src:"music/I Will Walk On Water Remix.mp3", genre:"Christian EDM"},
  {title:"If I Could Walk in His Boots (Country Pop)", artist:"RRN", src:"music/If I Could Walk in His Boots.mp3", genre:"Christian Country - Pop"},
  {title:"If I Only Touch Him (Outlaw Country)", artist:"RRN", src:"music/If I Only Touch Him  (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"I Will Walk on Water (EDM)", artist:"RRN", src:"music/(Intro _ Build-Up).mp3", genre:"Christian EDM"},
  {title:"In a Dry and Weary Land (Psychedelic Christian Rock Version)", artist:"RRN", src:"music/In a Dry and Weary Land Country Rock.mp3", genre:"Psychedelic Christian Rock"},
  {title:"In a Dry and Weary Land (Hip-Hop)", artist:"RRN", src:"music/In a Dry and Weary Land Alternative R&B, Pop, Hip Hop.mp3", genre:"Christian Hip-Hop"},
  {title:"In His Grace (Hip-Hop)", artist:"RRN", src:"music/Bounce in His grace l.mp3", genre:"Christian Hip-Hop"},
  {title:"In the Shape You Left Behind (Lo-Fi)", artist:"RRN", src:"music/In the Shape You Left Behind (LoFi).mp3", genre:"Christian LoFi", isNew:true},
  {title:"In Your Presence (Bluegrass)", artist:"RRN", src:"music/In Your Presence (Bluegrass).mp3", genre:"Christian Bluegrass", isNew:true},
  {title:"Issue of Blood (Teaching)", artist:"RRN Teaching", src:"music/Issue_Blood.mp3", genre:"Biblical Teaching"},
  {title:"I'm Free (Country Pop)", artist:"RRN", src:"music/I’M FREE.mp3", genre:"Christian Country - Pop"},
  {title:"Joyful Noise (Celebrate His Name Mix) (EDM)", artist:"RRN", src:"music/Joyful Noise (Celebrate His Name Mix).mp3", genre:"Christian EDM"},
  {title:"Joyful Noise (EDM)", artist:"RRN", src:"music/Joyful Noise t3 (1).mp3", genre:"Christian EDM"},
  {title:"Kingdom Beat (K-Pop)", artist:"RRN", src:"music/Kingdom beat,.mp3", genre:"Christian K-Pop"},
  {title:"Kingdom Drill No Excuses (Blues-Jazz)", artist:"RRN", src:"music/KINGDOM DRILL – NO EXCUSES”.mp3", genre:"Christian Hip-Hop"},
  {title:"Lazarus (Teaching)", artist:"RRN Teaching", src:"music/Lazarus_Finished.mp3", genre:"Biblical Teaching"},
  {title:"Let Jesus Decide (Alternative 2000s Rock)", artist:"RRN", src:"music/Let Jesus Decide (Alt 2000s Rock).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"Lift My Head (80s)", artist:"RRN", src:"music/Lift-my-head.mp3", genre:"Christian 80's"},
  {title:"Lift My Head (Blues-Jazz)", artist:"RRN", src:"music/Lift my headt11 (1).mp3", genre:"Christian Blues-Jazz"},
  {title:"Lift My Head (R&B)", artist:"RRN", src:"music/Lift my headt11.mp3", genre:"Christian R&B"},
  {title:"Light Breaks the Chains (Gospel Blues)", artist:"RRN", src:"music/“Light Breaks the Chain)” Blues Jazz (1).mp3", genre:"Gospel Blues"},
  {title:"Light In the Shadows (K-Pop)", artist:"RRN", src:"music/Light In the Shadows (K - Pop).mp3", genre:"Christian K-Pop", isNew:true},
  {title:"Light That Never Fails (Worship)", artist:"RRN", src:"music/Light That Never Fails (Worship).mp3", genre:"Contemporary Worship", isNew:true},
  {title:"Light That Never Falls (Worship)", artist:"RRN", src:"music/LIGHT THAT NEVER FALLS.mp3", genre:"Contemporary Worship", isNew:true},
  {title:"Locust Years (Worship Rock)", artist:"RRN", src:"music/Locust Years Cowboy Outlaw Rock (1).mp3", genre:"Worship Rock"},
  {title:"Locust Years Gospel Soul Worship Ballad (Praise & Worship)", artist:"RRN", src:"music/Locust Years Gospel Soul Worship Ballad (1).mp3", genre:"Praise & Worship"},
  {title:"Loosed (Outlaw Country)", artist:"RRN", src:"music/Loosed  (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Lord, Do Not Rebuke Me in Your Anger (Country Pop)", artist:"RRN", src:"music/Lord, Do Not Rebuke Me in Your Anger (1).mp3", genre:"Christian Country - Pop"},
  {title:"Lord, Do Not Rebuke Me in Your Anger (Southern Blues Rock)", artist:"RRN", src:"music/Lord, Do Not Rebuke Me in Your Anger.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Mercy Sorrow Crucible (Southern Christian Rock)", artist:"RRN", src:"music/Mercy-Sorrow Crucible.mp3", genre:"Southern Christian Rock"},
  {title:"Midnight Grace (Studio Freestyle Worship) (80s)", artist:"RRN", src:"music/Midnight Grace (Studio Freestyle Worship) (1).mp3", genre:"Christian 80's"},
  {title:"Mocker in the Cup (Gospel Blues)", artist:"RRN", src:"music/Mocker in the Cup Blues.mp3", genre:"Gospel Blues"},
  {title:"Mocker in the Cup (K-Pop Radio)", artist:"RRN", src:"music/Mocker in the Cup Radio.mp3", genre:"Christian K-Pop"},
  {title:"Mocker in the Cup (Psychedelic Christian Rock Version)", artist:"RRN", src:"music/Mocker in the Cup Psychedelic Rock Version.mp3", genre:"Psychedelic Christian Rock"},
  {title:"My Only Amen (Bounce Drop)", artist:"RRN", src:"music/MY ONLY AMEN— Bounce Drop Country Rap,.mp3", genre:"Christian Bounce Drop"},
  {title:"My Wig Blew Off and Started a Revival (Bounce Drop)", artist:"RRN", src:"music/MY WIG BLEW OFF AND STARTED A REVIVAL— Bounce Drop Country Rap,.mp3", genre:"Christian Bounce Drop"},
  {title:"New Anthem Love (80s)", artist:"RRN", src:"music/New Anthem Love.mp3", genre:"Christian 80's"},
  {title:"Not the Devil I Used to Be (Southern Blues Rock)", artist:"RRN", src:"music/Not The Devil I used to Be.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Nylon String Hallelujah (Worship)", artist:"RRN", src:"music/Nylon-String Hallelujah.mp3", genre:"Contemporary Worship"},
  {title:"Old Warrior at the Water (Southern Blues Rock)", artist:"RRN", src:"music/Old Warrior at the Water.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Only God Changes You (Teaching)", artist:"RRN Teaching", src:"music/Only_God_Changes_You.mp3", genre:"Biblical Teaching"},
  {title:"Out of the Depths (Psychedelic Christian Rock)", artist:"RRN", src:"music/Out of the Depths Country Rock (1).mp3", genre:"Psychedelic Christian Rock"},
  {title:"Out of the Depths Gospel Soul Worship Ballad (Praise & Worship)", artist:"RRN", src:"music/Out of the Depths Gospel Soul Worship Ballad.mp3", genre:"Praise & Worship"},
  {title:"Overcome in Rest (Alternative R&B)", artist:"RRN", src:"music/Overcome in Rest Radio (1).mp3", genre:"Christian Alternative R&B"},
  {title:"Overcome in Rest (Southern Blues Rock)", artist:"RRN", src:"music/Overcome in Rest.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Pain and Pride (Blues-Jazz)", artist:"RRN", src:"music/Pain and Pride (1).mp3", genre:"Christian Blues-Jazz"},
  {title:"Pain and Pride (Soul)", artist:"RRN", src:"music/Pain and Pride.mp3", genre:"Christian Soul"},
  {title:"Pain and Pride (Southern Blues Rock)", artist:"RRN", src:"music/Pain and Pride Best.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Pain and Pride (Alternative R&B)", artist:"RRN", src:"music/Pain and Rpride Radio.mp3", genre:"Christian Alternative R&B"},
  {title:"Pressing Through the Thorn (Southern Blues Rock)", artist:"RRN", src:"music/Pressing Through the Thorn (Still Sent) (1).mp3", genre:"Christian Southern Blues Rock"},
  {title:"Proven Armor (Alternative R&B)", artist:"RRN", src:"music/Proven Armor Radio (1).mp3", genre:"Christian Alternative R&B"},
  {title:"Proven Armor (EDM)", artist:"RRN", src:"music/Proven Armor Radio edm (1).mp3", genre:"Christian EDM"},
  {title:"Proven Armor (Southern Christian Rock)", artist:"RRN", src:"music/Proven Armor.mp3", genre:"Southern Christian Rock"},
  {title:"Quiet Pain (Southern Blues Rock)", artist:"RRN", src:"music/Quiet Pain.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Refined By His Hand (Hip-Hop)", artist:"RRN", src:"music/Refined By His Hand (HipHop).mp3", genre:"Christian Hip-Hop", isNew:true},
  {title:"Rip It Off (Alternative 2000s Rock)", artist:"RRN", src:"music/Rip It Off (Alt 2000s Rock).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"River of Grace (Country Pop)", artist:"RRN", src:"music/River-of-Grace-808.mp3", genre:"Christian Country - Pop"},
  {title:"Road Home Mercy (Country Pop)", artist:"RRN", src:"music/Road Home Mercy.mp3", genre:"Christian Country - Pop"},
  {title:"Road to Damascus (Outlaw Country)", artist:"RRN", src:"music/Road to Damascus (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Rose of Sharon (Lo-Fi)", artist:"RRN", src:"music/Rose Of Sharron (LoFi).mp3", genre:"Christian LoFi", isNew:true},
  {title:"Running on Empty (EDM)", artist:"RRN", src:"music/RUNNING ON EMPTY.mp3", genre:"Christian EDM"},
  {title:"Runnin’ Across the Pew Top (Bounce Drop)", artist:"RRN", src:"music/RUNNIN’ ACROSS THE PEW TOP — Bounce Drop Country Rap,.mp3", genre:"Christian Bounce Drop"},
  {title:"Save My Marriage, Jesus (Country)", artist:"RRN", src:"music/Save My Marriage, Jesus Country Rock.mp3", genre:"Christian Country"},
  {title:"Selah (EDM)", artist:"RRN", src:"music/Selah.mp3", genre:"Christian EDM"},
  {title:"Seven Times I Rise (Chillwave)", artist:"RRN", src:"music/Seven Times I Rise Chill.mp3", genre:"Christian Chillwave"},
  {title:"Seven Times I Rise (Southern Christian Rock)", artist:"RRN", src:"music/Seven Times I Rise.mp3", genre:"Southern Christian Rock"},
  {title:"Simon Peter (Teaching)", artist:"RRN Teaching", src:"music/Simon_Peter.mp3", genre:"Biblical Teaching"},
  {title:"Sippin’ on Grace & Truth (Country Rap Bounce Drop)", artist:"RRN", src:"music/Sippin’ on Grace & Truth  Bounce Drop Country Rap.mp3", genre:"Christian Bounce Drop"},
  {title:"Spoken For (2000s Alternative Metal)", artist:"RRN", src:"music/Spoken For (1).mp3", genre:"Christian 2000s Alternative Metal"},
  {title:"Spoken For (Euro Rave EDM)", artist:"RRN", src:"music/Spoken For (euro rave bounce).mp3", genre:"Christian EDM"},
  {title:"Standing in the Fire (EDM)", artist:"RRN", src:"music/Standing in the fire Trance (1).mp3", genre:"Christian EDM"},
  {title:"Started with a Dream (Southern Christian Rock)", artist:"RRN", src:"music/“Started With a Dream” (Edit).mp3", genre:"Southern Christian Rock"},
  {title:"Stay in Your Love (Smooth Groove Version) (80s)", artist:"RRN", src:"music/Stay in Your Love” (Smooth Groove Version)_.mp3", genre:"Christian 80's"},
  {title:"Stay in Your Love (Smooth Version) (EDM)", artist:"RRN", src:"music/Stay in Your Love” (Smooth Version)_.mp3", genre:"Christian EDM"},
  {title:"Step Strong (EDM)", artist:"RRN", src:"music/Step Strong (euro hop).mp3", genre:"Christian EDM"},
  {title:"Still in Your Hands (Pop)", artist:"RRN", src:"music/Still In Your Hands Pop.mp3", genre:"Christian Pop"},
  {title:"Still in Your Hands Gospel Soul Worship Ballad (Testimony)", artist:"RRN", src:"music/Still In Your Hands Gospel Soul Worship Ballad.mp3", genre:"Testimony"},
  {title:"Still You Hold Me (Worship)", artist:"RRN", src:"music/Still You Hold Me Contemporary Worship.mp3", genre:"Contemporary Worship"},
  {title:"Strapped (Hip-Hop)", artist:"RRN", src:"music/Straped.mp3", genre:"Christian Hip-Hop"},
  {title:"Strapped (Trip-Hop)", artist:"RRN", src:"music/Strapedt18.mp3", genre:"Christian Trip-Hop"},
  {title:"Strapped X Fire in My Bones (Trip-Hop)", artist:"RRN", src:"music/Straped x Fire in My Bones (Mashup)t19 (0.89x)t20.mp3", genre:"Christian Trip-Hop"},
  {title:"Strapped X Fire in My Bones Mashup 0 89x (Trip-Hop)", artist:"RRN", src:"music/Straped-x-Fire-in-My-Bones-Mashup-0-89x.mp3", genre:"Christian Trip-Hop"},
  {title:"Strong and Brave (Hip-Hop)", artist:"RRN", src:"music/Strong and Brave Alternative R&B, Pop, Hip Hop.mp3", genre:"Christian Hip-Hop"},
  {title:"Strong and Brave Pop (Gospel Blues)", artist:"RRN", src:"music/Strong and Brave Blues Pop.mp3", genre:"Gospel Blues"},
  {title:"Strong and Brave Version (Psychedelic Christian Rock)", artist:"RRN", src:"music/Strong and Brave Psychedelic Rock Version (1).mp3", genre:"Psychedelic Christian Rock"},
  {title:"Stronger Than the Pain (Bass Drums Dance)", artist:"RRN", src:"music/Stronger Than the Pain (bass drums).mp3", genre:"Christian Dance"},
  {title:"Stronger Than the Pain (Trip-Hop)", artist:"RRN", src:"music/Stronger Than the Pain.mp3", genre:"Christian Trip-Hop"},
  {title:"Stronger Than the Pain Clubmix (Dance)", artist:"RRN", src:"music/Stronger Than the Pain ClubMix (1).mp3", genre:"Christian Dance"},
  {title:"Stronger Than the Pain Rap Version (Trip-Hop)", artist:"RRN", src:"music/Stronger-Than-the-Pain-Rap-version.mp3", genre:"Christian Trip-Hop"},
  {title:"Stronger Than the Pain Tear the Roof Club Mix (Dance)", artist:"RRN", src:"music/Stronger than The Pain Tear The Roof  Club Mix (1).mp3", genre:"Christian Dance"},
  {title:"Stronger Than the Pain Version (Rap)", artist:"RRN", src:"music/Stronger Than the Paint16 Rap version.mp3", genre:"Christian Rap"},
  {title:"Sweeter Than the Chains (Southern Christian Rock)", artist:"RRN", src:"music/Sweeter Than the Chains Southern Rock (1).mp3", genre:"Southern Christian Rock"},
  {title:"Sword I Carry Now (Testimony)", artist:"RRN", src:"music/Sword I Carry Now.mp3", genre:"Testimony Songs"},
  {title:"Tear the Roof (Hip-Hop)", artist:"RRN", src:"music/Tear the Roof (1).mp3", genre:"Christian Hip-Hop"},
  {title:"Tear the Roof X Stronger Than the Pain (Mashup) (Trip-Hop)", artist:"RRN", src:"music/Tear the Roof x Stronger Than the Pain (Mashup) (2).mp3", genre:"Christian Trip-Hop"},
  {title:"The Horse and Rider (Southern Christian Rock)", artist:"RRN", src:"music/The Horse and Rider.mp3", genre:"Southern Christian Rock"},
  {title:"The Nitty Gritty Devil (Psychedelic Christian Rock)", artist:"RRN", src:"music/The Nitty Gritty Devil Country Rock (1).mp3", genre:"Psychedelic Christian Rock"},
  {title:"The Rider in the Sky (Country)", artist:"RRN", src:"music/The Rider in the Sky (1).mp3", genre:"Christian Country"},
  {title:"The Rider in the Sky (Pop)", artist:"RRN", src:"music/The Rider in the Sky.mp3", genre:"Christian Pop"},
  {title:"The Things You Never Saw (Hip-Hop)", artist:"RRN", src:"music/The Things you Never Saw Alternative R&B, Pop, Hip Hop.mp3", genre:"Christian Hip-Hop"},
  {title:"Those Nail Scarred Hands (R&B)", artist:"RRN", src:"music/Those nail-scarred hands.mp3", genre:"Christian R&B"},
  {title:"Through the Roof (Outlaw Country)", artist:"RRN", src:"music/Through the Roof (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Today You Will Be With Me (Outlaw Country)", artist:"RRN", src:"music/Today You Will Be With Me  (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Tongues of Fire Club (EDM)", artist:"RRN", src:"music/Tongues of Fire  Club.mp3", genre:"Christian EDM"},
  {title:"Tongues of Fire Country Rap (Southern Blues Rock)", artist:"RRN", src:"music/Tongues of Fire  Bounce Drop Country Rap.mp3", genre:"Christian Southern Blues Rock"},
  {title:"Tongues of Fire Country Rap — Remix (Alternative 2000s Rock)", artist:"RRN", src:"music/Tongues of Fire  Bounce Drop Country Rap.mp3", genre:"Christian Alternative Rock"},
  {title:"Too Far Gone (Bluegrass)", artist:"RRN", src:"music/Too Far Gone (Bluegrass).mp3", genre:"Christian Bluegrass", isNew:true},
  {title:"Trusted Witness (Teaching)", artist:"RRN Teaching", src:"music/Trusted_Witness.mp3", genre:"Biblical Teaching"},
  {title:"Tryna Stay Awake in Church (Country Rap Bounce Drop)", artist:"RRN", src:"music/Tryna Stay Awake in Church Bounce Drop Country Rap.mp3", genre:"Christian Bounce Drop"},
  {title:"Use This Pain (Soul)", artist:"RRN", src:"music/Use this pain.mp3", genre:"Christian Soul"},
  {title:"Valley Nightlight (Country)", artist:"RRN", src:"music/Valley Nightlight.mp3", genre:"Christian Country"},
  {title:"Vapor in the Wind (Blues-Jazz)", artist:"RRN", src:"music/Vapor in the Wind (1).mp3", genre:"Christian Blues-Jazz"},
  {title:"Vapor in the Wind (Gospel Blues)", artist:"RRN", src:"music/Vapor in the Wind.mp3", genre:"Gospel Blues"},
  {title:"Walk It Out (K-Pop)", artist:"RRN", src:"music/Walk it Out.mp3", genre:"Christian K-Pop"},
  {title:"Walk Upright (Praise & Worship)", artist:"RRN", src:"music/Walk Upright.mp3", genre:"Praise & Worship"},
  {title:"Walking in Di Light (Reggae)", artist:"RRN", src:"music/Walking in di Light.mp3", genre:"Christian Rege"},
  {title:"We Knew God (Pop)", artist:"RRN", src:"music/We Knew God Radio (1).mp3", genre:"Christian Pop"},
  {title:"What I Lay at the Altar (Worship)", artist:"RRN", src:"music/What I Lay at the Altar.mp3", genre:"Contemporary Worship", isNew:true},
  {title:"When Fever Lost Its Claim (Outlaw Country)", artist:"RRN", src:"music/When Fever Lost Its Claim  (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Where Are Your Accusers? (Outlaw Country)", artist:"RRN", src:"music/Where Are Your Accusers_ (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Wilt Thou Be Made Whole (Outlaw Country)", artist:"RRN", src:"music/Wilt Thou Be Made Whole (Outlaw Country).mp3", genre:"Christian Outlaw Country", isNew:true},
  {title:"Witness in the Fire (Praise & Worship)", artist:"RRN", src:"music/WITNESS IN THE FIRE.mp3", genre:"Praise & Worship"},
  {title:"Witness in the Fire (Tribal Chant) (Alternative R&B)", artist:"RRN", src:"music/WITNESS IN THE FIRE (2).mp3", genre:"Christian Alternative R&B"},
  {title:"Witness in the Fire (Worship Rock)", artist:"RRN", src:"music/WITNESS IN THE FIRE (1).mp3", genre:"Worship Rock"},
  {title:"You Alone Are Holy", artist:"RRN", src:"music/You Alone Are Holy.mp3", genre:"Contemporary Worship", isNew:true},
  {title:"You Alone Are Holy (Alternative R&B)", artist:"RRN", src:"music/You Alone Are Holy.mp3", genre:"Christian Alternative R&B"},
  {title:"You Answer When I Call (Praise & Worship)", artist:"RRN", src:"music/You answer when I call (1).mp3", genre:"Praise & Worship"},
  {title:"You Are My Joy (Dance)", artist:"RRN", src:"music/You Are My Joy (Dance).mp3", genre:"Christian Dance", isNew:true},
  {title:"You Are My Joy (Lo-Fi)", artist:"RRN", src:"music/You Are My Joy (LoFi).mp3", genre:"Christian LoFi", isNew:true},
  {title:"You Hold Me Up (Pop)", artist:"RRN", src:"music/You Hold Mde Up Radio.mp3", genre:"Christian Pop"},
  {title:"You Hold Me Up (Country Pop)", artist:"RRN", src:"music/You Hold Me Up (1).mp3", genre:"Christian Country - Pop"},
  {title:"You Never Let Go (Worship)", artist:"RRN", src:"music/You Never Let Go Contemporary Worship.mp3", genre:"Contemporary Worship"},
  {title:"You Never Let Go (Worship)", artist:"RRN", src:"music/You Never Let Go Contemporary Worship.mp3", genre:"Contemporary Worship", isNew:true},
  {title:"You Speak for Me (Soul)", artist:"RRN", src:"music/You speak for me.mp3", genre:"Christian Soul"},
  {title:"Your Holy Heartbeat Stays (Club Mix) (Alternative R&B)", artist:"RRN", src:"music/Your Holy Heartbeat Stays (Club Mix).mp3", genre:"Christian Alternative R&B"},
  {title:"Your Holy Heartbeat Stays (Concert Mix Smooth) (Stage Style)", artist:"RRN", src:"music/Your Holy Heartbeat Stays (Concert Mix Smooth).mp3", genre:"Christian Stage Style"},
  {title:"Your Holy Heartbeat Stays (Concert Mix) (Stage Style)", artist:"RRN", src:"music/Your Holy Heartbeat Stays (Concert Mix).mp3", genre:"Christian Stage Style"},
  {title:"The Way You Lead Me (Alt Rock)", artist:"RRN", src:"music/The Way You Lead Me  (Alt 2000s Rock).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"He Never Quit on Me (Alt Rock)", artist:"RRN", src:"music/He Never Quit on Me (Alternative 2000s Rock).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"He Spoke to the Wind (80s)", artist:"RRN", src:"music/He Spoke to the Wind (80s).mp3", genre:"Christian 80's", isNew:true},
  {title:"Awoken the Master (Southern Blues Rock)", artist:"RRN", src:"music/Awoken the Master (Southern Blues Rock).mp3", genre:"Christian Southern Blues Rock", isNew:true},
  {title:"Sweet Release (Chill)", artist:"RRN", src:"music/Sweet Release (Chill).mp3", genre:"Christian Chillwave", isNew:true},
  {title:"He Strengthens Me (Alt Rock)", artist:"RRN", src:"music/He Strengthens Me (Alternative 2000s Rock).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"Shine His Light (K-Pop)", artist:"RRN", src:"music/Shine His Light (K -Pop).mp3", genre:"Christian K-Pop", isNew:true},
  {title:"I Can Count on You (Country)", artist:"RRN", src:"music/I Can Count on You (Country).mp3", genre:"Christian Country", isNew:true},
  {title:"What Must I Do (Alt Rock)", artist:"RRN", src:"music/What Must I Do (2000s Alternative Metal).mp3", genre:"Christian Alternative Rock", isNew:true},
  {title:"One Promise (R&B)", artist:"RRN", src:"music/One Promise (R&B).mp3", genre:"Christian R&B", isNew:true},
  {title:"Boots-A-Stompin’ (For the King) (Country)", artist:"RRN", src:"music/Boots-A-Stompin’ (For the King) (Country).mp3", genre:"Christian Country", isNew:true},
  {title:"Spirit, Don't Let Me Check My Messages", artist:"RRN", src:"music/Spirit, Don’t Let Me Check My Messages”.mp3", genre:"Christian Worship Pop"},
  {title:"I Tried to Run, But the Choir Caught Me", artist:"RRN", src:"music/I Tried to Run, But the Choir Caught Me.mp3", genre:"Christian Gospel Soul"},
  {title:"Devil Lost My Address", artist:"RRN", src:"music/Devil Lost My Address.mp3", genre:"Christian Outlaw Country"},
  {title:"Your Way Is Better", artist:"RRN", src:"music/Your Way Is Better (Contemporary Christian Pop Worship with Hip-Hop Elements).mp3", genre:"Christian Hip-Hop Worship"}
];

/* RRN AVAILABLE-NOW RESOLVER: points the existing playlist at the songs already on GitHub.
   Playlist is unchanged; only the file URL is resolved to where the file actually lives.
   Songs not yet uploaded keep their flat path and simply skip until they're up. */
(function(){
  var GMAP = {"beauty-holiness-spanish-guitar":"music/Acoustic/Beauty-Holiness-Spanish-Guitar.mp3","nylon-string-hallelujah":"music/Acoustic/Nylon-String-Hallelujah.mp3","he-lifts-the-lowly-male-blues-pop":"music/Blues/He-Lifts-the-Lowly-Male-Blues-Pop.mp3","fire-in-my-bones-chill":"music/Chill/Fire-in-My-Bones-Chill.mp3","granpa-was-a-preacher-man":"music/Country/Granpa-was-a-Preacher-Man.mp3","bounce-in-his-grace-l":"music/EDM-Club/Bounce-in-His-grace-l.mp3","fever":"music/EDM-Club/Fever.mp3","grace-fever":"music/EDM-Club/Grace-Fever.mp3","i-will-walk-on-water-remix":"music/EDM-Club/I-Will-Walk-On-Water-Remix.mp3","kingdom-drill-no-excuses":"music/EDM-Club/KINGDOM-DRILL-NO-EXCUSES.mp3","kingdom-beat":"music/EDM-Club/Kingdom-beat.mp3","proven-armor-radio-edm":"music/EDM-Club/Proven-Armor-Radio-edm.mp3","river-of-grace-808":"music/EDM-Club/River-of-Grace-808.mp3","spoken-for-euro-rave-bounce":"music/EDM-Club/Spoken-For-euro-rave-bounce.mp3","step-strong-euro-hop":"music/EDM-Club/Step-Strong-euro-hop.mp3","straped-x-fire-in-my-bones-mashup-0-89x":"music/EDM-Club/Straped-x-Fire-in-My-Bones-Mashup-0-89x.mp3","stronger-than-the-pain-clubmix":"music/EDM-Club/Stronger-Than-the-Pain-ClubMix.mp3","stronger-than-the-pain-rap-version":"music/EDM-Club/Stronger-Than-the-Pain-Rap-version.mp3","stronger-than-the-pain-tear-the-roof-club-mix":"music/EDM-Club/Stronger-than-The-Pain-Tear-The-Roof-Club-Mix.mp3","tear-the-roof-x-stronger-than-the-pain-mashup":"music/EDM-Club/Tear-the-Roof-x-Stronger-Than-the-Pain-Mashup.mp3","consuming-fire-jazz":"music/Jazz/Consuming-Fire-Jazz.mp3","light-breaks-the-chain-blues-jazz-1":"music/Jazz/Light-Breaks-the-Chain-Blues-Jazz-1.mp3","light-breaks-the-chain-blues-jazz":"music/Jazz/Light-Breaks-the-Chain-Blues-Jazz.mp3","hidden-glory-r-b":"music/R&B/Hidden-Glory-R-B.mp3","beauty-holiness-radio":"music/Radio/Beauty-Holiness-Radio.mp3","come-alive-chains-fall-down-radio":"music/Radio/Come-Alive-Chains-Fall-Down-Radio.mp3","double-portion-radio":"music/Radio/Double-Portion-Radio.mp3","fall-on-us-radio":"music/Radio/Fall-on-Us-Radio.mp3","fire-in-my-bones-radio":"music/Radio/Fire-in-My-Bones-Radio.mp3","overcome-in-rest-radio":"music/Radio/Overcome-in-Rest-Radio.mp3","pain-and-rpride-radio":"music/Radio/Pain-and-Rpride-Radio.mp3","proven-armor-radio":"music/Radio/Proven-Armor-Radio.mp3","a-whisper-from-hannah-country-rock":"music/Southern Rock/A-Whisper-From-Hannah-Country-Rock.mp3","broken-chains-psychedelic-rock-version-1":"music/Southern Rock/Broken-Chains-Psychedelic-Rock-Version-1.mp3","broken-chains-psychedelic-rock-version":"music/Southern Rock/Broken-Chains-Psychedelic-Rock-Version.mp3","foot-on-his-neck-country-rock-1":"music/Southern Rock/Foot-on-His-Neck-Country-Rock-1.mp3","foot-on-his-neck-country-rock":"music/Southern Rock/Foot-on-His-Neck-Country-Rock.mp3","god-s-glory-ends-my-story-country-rock":"music/Southern Rock/God-s-Glory-Ends-My-Story-Country-Rock.mp3","grace-runs-deep-like-a-river-psychedelic-rock-version-1":"music/Southern Rock/Grace-Runs-Deep-Like-a-River-Psychedelic-Rock-Version-1.mp3","grace-runs-deep-like-a-river-psychedelic-rock-version":"music/Southern Rock/Grace-Runs-Deep-Like-a-River-Psychedelic-Rock-Version.mp3","grace-this-place-outlaw-country-rock":"music/Southern Rock/Grace-This-Place-Outlaw-Country-Rock.mp3","hallelujah-in-the-fire-cowboy-outlaw-rock":"music/Southern Rock/Hallelujah-in-the-Fire-Cowboy-Outlaw-Rock.mp3","in-a-dry-and-weary-land-country-rock":"music/Southern Rock/In-a-Dry-and-Weary-Land-Country-Rock.mp3","locust-years-cowboy-outlaw-rock":"music/Southern Rock/Locust-Years-Cowboy-Outlaw-Rock.mp3","nightlight-salvation-band-southern-rock":"music/Southern Rock/Nightlight-Salvation-Band-Southern-Rock.mp3","out-of-the-depths-country-rock-1":"music/Southern Rock/Out-of-the-Depths-Country-Rock-1.mp3","out-of-the-depths-country-rock":"music/Southern Rock/Out-of-the-Depths-Country-Rock.mp3","save-my-marriage-jesus-country-rock":"music/Southern Rock/Save-My-Marriage-Jesus-Country-Rock.mp3","strong-and-brave-psychedelic-rock-version-1":"music/Southern Rock/Strong-and-Brave-Psychedelic-Rock-Version-1.mp3","strong-and-brave-psychedelic-rock-version":"music/Southern Rock/Strong-and-Brave-Psychedelic-Rock-Version.mp3","sweeter-than-the-chains-southern-rock-1":"music/Southern Rock/Sweeter-Than-the-Chains-Southern-Rock-1.mp3","sweeter-than-the-chains-southern-rock":"music/Southern Rock/Sweeter-Than-the-Chains-Southern-Rock.mp3","the-nitty-gritty-devil-country-rock-1":"music/Southern Rock/The-Nitty-Gritty-Devil-Country-Rock-1.mp3","the-nitty-gritty-devil-country-rock-2":"music/Southern Rock/The-Nitty-Gritty-Devil-Country-Rock-2.mp3","the-nitty-gritty-devil-country-rock":"music/Southern Rock/The-Nitty-Gritty-Devil-Country-Rock.mp3","beauty-for-ashes":"music/Worship/Beauty-for-Ashes.mp3","beyond-the-shadows":"music/Worship/Beyond-the-Shadows.mp3","break-the-silence":"music/Worship/Break-the-Silence.mp3","breath-on-glass":"music/Worship/Breath-on-Glass.mp3","called-by-name-i-am-yours":"music/Worship/CALLED-BY-NAME-I-AM-YOURS.mp3","chaos-vs-calling":"music/Worship/CHAOS-VS-CALLING.mp3","called-from-the-low-places":"music/Worship/Called-From-the-Low-Places.mp3","come-alive-chains-fall-down":"music/Worship/Come-Alive-Chains-Fall-Down.mp3","consuming-fire":"music/Worship/Consuming-Fire.mp3","divine-control":"music/Worship/Divine-Control.mp3","double-portion":"music/Worship/Double-Portion.mp3","faithfully":"music/Worship/FAITHFULLY.mp3","fragile-heart-eternal-light":"music/Worship/FRAGILE-HEART-ETERNAL-LIGHT.mp3","from-pit-to-purpose":"music/Worship/FROM-PIT-TO-PURPOSE.mp3","fallmon-us":"music/Worship/FallmOn-Us.mp3","father-s-steady-hands":"music/Worship/Father-s-Steady-Hands.mp3","fire-in-my-bones":"music/Worship/Fire-in-My-Bones.mp3","go-a-little-further":"music/Worship/Go-a-Little-Further.mp3","he-took-my-place":"music/Worship/HE-TOOK-MY-PLACE.mp3","hair-down-glory":"music/Worship/Hair-Down-Glory.mp3","hard-to-see-lines":"music/Worship/Hard-to-See-Lines.mp3","he-is-my-salvation":"music/Worship/He-Is-My-Salvation.mp3","he-lifts-the-lowly":"music/Worship/He-Lifts-the-Lowly.mp3","he-still-calls-my-name":"music/Worship/He-Still-Calls-My-Name.mp3","he-sustains-me-through-the-storm":"music/Worship/He-Sustains-Me-Through-the-Storm.mp3","hear-my-cause-o-lord":"music/Worship/Hear-My-Cause-O-Lord.mp3","here-comes-the-pain":"music/Worship/Here-Comes-the-Pain.mp3","hes-comming-back":"music/Worship/Hes-comming-back.mp3","hes-comming-backt":"music/Worship/Hes-comming-backt.mp3","hope-over-despair":"music/Worship/Hope-Over-Despair.mp3","i-m-free":"music/Worship/I-M-FREE.mp3","i-am-the-bride":"music/Worship/I-am-the-bride.mp3","if-i-could-walk-in-his-boots":"music/Worship/If-I-Could-Walk-in-His-Boots.mp3","intro-build-up":"music/Worship/Intro-Build-Up.mp3","joyful-noise-celebrate-his-name-mix":"music/Worship/Joyful-Noise-Celebrate-His-Name-Mix.mp3","joyful-noise":"music/Worship/Joyful-Noise.mp3","lift-my-head":"music/Worship/Lift-my-head.mp3","lord-do-not-rebuke-me-in-your-anger":"music/Worship/Lord-Do-Not-Rebuke-Me-in-Your-Anger.mp3","mercy-sorrow-crucible":"music/Worship/Mercy-Sorrow-Crucible.mp3","not-the-devil-i-used-to-be":"music/Worship/Not-The-Devil-I-used-to-Be.mp3","running-on-empty":"music/Worship/RUNNING-ON-EMPTY.mp3","road-home-mercy":"music/Worship/Road-Home-Mercy.mp3","selah":"music/Worship/Selah.mp3","seven-times-i-rise":"music/Worship/Seven-Times-I-Rise.mp3","spoken-for-refined":"music/Worship/Spoken-For-Refined.mp3","spoken-for":"music/Worship/Spoken-For.mp3","started-with-a-dream-edit":"music/Worship/Started-With-a-Dream-Edit.mp3","still-standin":"music/Worship/Still-Standin.mp3","straped":"music/Worship/Straped.mp3","stronger-than-the-pain-bass-drums":"music/Worship/Stronger-Than-the-Pain-bass-drums.mp3","stronger-than-the-pain":"music/Worship/Stronger-Than-the-Pain.mp3","sword-i-carry-now":"music/Worship/Sword-I-Carry-Now.mp3","tear-the-roof":"music/Worship/Tear-the-Roof.mp3","the-horse-and-rider":"music/Worship/The-Horse-and-Rider.mp3","the-rider-in-the-sky":"music/Worship/The-Rider-in-the-Sky.mp3","those-nail-scarred-hands":"music/Worship/Those-nail-scarred-hands.mp3","use-this-pain":"music/Worship/Use-this-pain.mp3","valley-nightlight":"music/Worship/Valley-Nightlight.mp3","vapor-in-the-wind":"music/Worship/Vapor-in-the-Wind.mp3","witness-in-the-fire":"music/Worship/WITNESS-IN-THE-FIRE.mp3","walk-upright":"music/Worship/Walk-Upright.mp3","walk-it-out":"music/Worship/Walk-it-Out.mp3","walking-in-di-light":"music/Worship/Walking-in-di-Light.mp3","you-hold-me-up":"music/Worship/You-Hold-Me-Up.mp3","you-answer-when-i-call":"music/Worship/You-answer-when-I-call.mp3","you-speak-for-me":"music/Worship/You-speak-for-me.mp3"};
  function _norm(s){ s=(s||'').split('/').pop(); s=s.replace(/\.mp3$/i,''); return s.replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase(); }
  var hit=0;
  try{
    for(var i=0;i<RR_LIBRARY.length;i++){
      var k=_norm(RR_LIBRARY[i].src);
      if(GMAP[k]){ RR_LIBRARY[i].src=GMAP[k]; hit++; }
    }
    if(window.console)console.log('RRN resolver: '+hit+' of '+RR_LIBRARY.length+' songs pointed at live files.');
  }catch(e){ if(window.console)console.warn('RRN resolver error',e); }
})();

var RR_SEED_SCORES = {"music/The Things you Never Saw Alternative R&B, Pop, Hip Hop.mp3": 5, "music/Strong and Brave Alternative R&B, Pop, Hip Hop.mp3": 3, "music/Still You Hold Me Contemporary Worship.mp3": 5, "music/RUNNIN\u2019 ACROSS THE PEW TOP \u2014 Bounce Drop Country Rap,.mp3": 4, "music/MY WIG BLEW OFF AND STARTED A REVIVAL\u2014 Bounce Drop Country Rap,.mp3": 5, "music/MY WIG BLEW OFF AND STARTED A REVIVAL\u2014 Bounce Drop Country Rap, (2).mp3": 5, "music/MY WIG BLEW OFF AND STARTED A REVIVAL\u2014 Bounce Drop Country Rap, (1).mp3": 5, "music/MY ONLY AMEN\u2014 Bounce Drop Country Rap,.mp3": 3, "music/In a Dry and Weary Land Alternative R&B, Pop, Hip Hop.mp3": 5, "music/I Almost Left My Coffee in the Pew \u2014 Bounce Drop Country Rap,.mp3": 3, "music/GROUNDED IN VICTORY\u2014 Post-Grunge.mp3": 5, "music/GROUNDED IN VICTORY\u2014 Blues Rock.mp3": 5, "music/GROUNDED IN VICTORY\u2014 Blues Rock (1).mp3": 2, "music/GRANDMA OUTDANCED ME IN CHURCH \u2014 Bounce Drop Country Rap,.mp3": 4, "music/God's Glory Ends My Story Modern country-pop.mp3": 3, "music/God's Glory Ends My Story Classic Country Honky-tonk.mp3": 5, "music/God's Glory Ends My Story Classic Country Honky-tonk (1).mp3": 4, "music/Fall on U s Outlaw Country (2).mp3": 3, "music/Fall on U s Outlaw Country (1).mp3": 5, "music/CROWN OF THORNS, HANDS OF GRACE\u2014 Post-Grunge.mp3": 5, "music/Broken but Yours (Worship).mp3": 3, "music/ABIDE IN YOU\u2014 Post-Grunge.mp3": 3, "music/ABIDE IN YOU\u2014 DANCE FLOOR ANTHEM.mp3": 3, "music/\u201cI QUOTED THE WRONG VERSE (IT WAS A BURGER KING AD)\u2014 Bounce Drop Country Rap,.mp3": 3, "music/You Never Let Go Contemporary Worship.mp3": 3, "music/We Knew God Radio (1).mp3": 5, "music/\u201cLight Breaks the Chain)\u201d Blues Jazz (1).mp3": 3, "music/\u201cLight Breaks the Chain)\u201d Blues Jazz.mp3": 3, "music/\u201cStarted With a Dream\u201d (Edit).mp3": 4, "music/A Vapor Breath.mp3": 3, "music/A Whisper From Hannah Country Rock.mp3": 3, "music/Beauty for Ashes (1).mp3": 3, "music/Beauty Holiness Radio.mp3": 3, "music/Beauty Holiness Spanish Guitar (1).mp3": 3, "music/Beauty Holiness Spanish Guitar.mp3": 3, "music/Beyond the Shadows.mp3": 5, "music/Blessed & a Mess Bounce Drop Country Rap (1).mp3": 4, "music/Blessed & a Mess Bounce Drop Country Rap.mp3": 4, "music/Bounce in His grace l.mp3": 3, "music/Break the Silence\u201d.mp3": 3, "music/Breath on Glass (1).mp3": 3, "music/Breath on Glass.mp3": 3, "music/Broken Chains Psychedelic Rock Version (1).mp3": 4, "music/Broken Chains Psychedelic Rock Version.mp3": 4, "music/CALLED BY NAME (I AM YOURS) (1).mp3": 3, "music/CALLED BY NAME (I AM YOURS).mp3": 3, "music/Called From the Low Places (1).mp3": 5, "music/Called From the Low Places (2).mp3": 5, "music/Called From the Low Places (4).mp3": 3, "music/Called From the Low Places.mp3": 3, "music/CHAOS VS CALLING (1).mp3": 3, "music/CHAOS VS CALLING.mp3": 3, "music/Church N Chicken Bounce Drop Country Rap.mp3": 4, "music/Clock Won\u2019t Let Go Bounce Drop Country Rap.mp3": 5, "music/Closer Than My Breath Pop.mp3": 3, "music/Come Alive (Chains Fall Down) Radio (1).mp3": 3, "music/Come Alive (Chains Fall Down) Radio.mp3": 3, "music/Come Alive (Chains Fall Down).mp3": 4, "music/Consuming Fire (1).mp3": 4, "music/Consuming Fire Country.mp3": 3, "music/Consuming Fire Jazz.mp3": 3, "music/Consuming Fire.mp3": 3, "music/Daughter Again EDM (1).mp3": 3, "music/Daughter Again EDM.mp3": 3, "music/Daughter Again Pop (1).mp3": 5, "music/Daughter Again Pop.mp3": 5, "music/Divine Controlt13.mp3": 0, "music/Double Portion Radio (1).mp3": 3, "music/Double Portion.mp3": 3, "music/FAITHFULLY.mp3": 3, "music/FAITHFULLYt8.mp3": 2, "music/Fall on U s Outlaw Country.mp3": 5, "music/Fall on Us Chill.mp3": 3, "music/Fall on Us Radio (1).mp3": 0, "music/Fall on Us Radio (2).mp3": 0, "music/Fall on Us Radio.mp3": 0, "music/FallmOn Us.mp3": 3, "music/Father\u2019s Steady Hands.mp3": 5, "music/Fever.mp3": 0, "music/Fire in My Bones (1).mp3": 0, "music/Fire in My Bones (2).mp3": 0, "music/Fire in My Bones Chill (1).mp3": 5, "music/Fire in My Bones Chill.mp3": 3, "music/Fire in My Bones Radio (1).mp3": 4, "music/Fire in My Bones Radio.mp3": 0, "music/Fire in My Bones.mp3": 0, "music/Foot on His Neck Country Rock (1).mp3": 5, "music/Foot on His Neck Country Rock.mp3": 3, "music/FRAGILE HEART, ETERNAL LIGHTt6 (1).mp3": 0, "music/FRAGILE HEART, ETERNAL LIGHTt6.mp3": 0, "music/FROM PIT TO PURPOSE.mp3": 0, "music/FROM PIT TO PURPOSEt7 (1).mp3": 3, "music/FROM PIT TO PURPOSEt7.mp3": 3, "music/Go a Little Further (1).mp3": 3, "music/Go a Little Further.mp3": 3, "music/God's Glory Ends My Story  Country Rock.mp3": 3, "music/God's Glory Ends My Story Gospel Soul Worship Ballad.mp3": 5, "music/Grace Fever.mp3": 3, "music/Grace This Place Outlaw Country Rock.mp3": 5, "music/Grandma Said Amen Bounce Drop Country Rap.mp3": 4, "music/Granpa was a Preacher Man (1).mp3": 5, "music/Granpa was a Preacher Man.mp3": 5, "music/Hair Down Glory (1).mp3": 3, "music/Hair Down Glory.mp3": 4, "music/Hallelujah in the Fire Cowboy Outlaw Rock.mp3": 4, "music/Hallelujah Lamb Trance (1).mp3": 3, "music/Hallelujah Lamb Trance (2).mp3": 3, "music/Hallelujah Lamb Trance (3).mp3": 3, "music/Hallelujah Lamb Trance (4).mp3": 2, "music/Hallelujah Lamb Trance.mp3": 3, "music/Hard-to-See Lines.mp3": 5, "music/He Is My Salvation t4 (1).mp3": 3, "music/He Is My Salvation t4 (2).mp3": 3, "music/He Is My Salvation t4 (3).mp3": 3, "music/He Is My Salvation t4.mp3": 3, "music/He Lifts the Lowly (1).mp3": 3, "music/He Lifts the Lowly (2).mp3": 4, "music/He Lifts the Lowly Male Blues Pop (1).mp3": 3, "music/He Lifts the Lowly Male Blues Pop.mp3": 3, "music/He Lifts the Lowly.mp3": 3, "music/He Still Calls My Name (1).mp3": 3, "music/He Still Calls My Name.mp3": 5, "music/He Sustains Me Through the Storm.mp3": 3, "music/HE TOOK MY PLACE.mp3": 4, "music/Hear My Cause, O Lord (1).mp3": 4, "music/Hear My Cause, O Lord.mp3": 3, "music/Here Comes the Paint17 (1).mp3": 3, "music/Here Comes the Paint17 (2).mp3": 3, "music/Here Comes the Paint17.mp3": 3, "music/Hes comming back.mp3": 3, "music/Hes comming backt.mp3": 3, "music/Hes comming backt10 (1).mp3": 3, "music/Hes comming backt10.mp3": 3, "music/Hidden Glory R&B.mp3": 5, "music/Hope Over Despair.mp3": 3, "music/I am the bride.mp3": 3, "music/I am Yours Chill.mp3": 4, "music/I Was Running (But Mercy Caught Me) Chill.mp3": 3, "music/I Will Walk On Water Remix.mp3": 4, "music/I Will Walk On Water Remixt14 (1).mp3": 5, "music/I Will Walk On Water Remixt14 (2).mp3": 3, "music/I Will Walk On Water Remixt14 (3).mp3": 4, "music/I Will Walk On Water Remixt14.mp3": 3, "music/I\u2019M FREE.mp3": 3, "music/If I Could Walk in His Boots.mp3": 5, "music/In a Dry and Weary Land Country Rock.mp3": 5, "music/Joyful Noise (Celebrate His Name Mix).mp3": 3, "music/Joyful Noise t3 (1).mp3": 3, "music/Joyful Noise t3.mp3": 3, "music/Kingdom beat,.mp3": 5, "music/KINGDOM DRILL \u2013 NO EXCUSES\u201d.mp3": 5, "music/Lift my headt11 (1).mp3": 3, "music/Lift my headt11.mp3": 3, "music/Locust Years Cowboy Outlaw Rock (1).mp3": 5, "music/Locust Years Cowboy Outlaw Rock.mp3": 5, "music/Locust Years Gospel Soul Worship Ballad (1).mp3": 4, "music/Locust Years Gospel Soul Worship Ballad (2).mp3": 4, "music/Lord, Do Not Rebuke Me in Your Anger (1).mp3": 3, "music/Lord, Do Not Rebuke Me in Your Anger.mp3": 3, "music/Mercy-Sorrow Crucible.mp3": 5, "music/Mocker in the Cup Blues.mp3": 5, "music/Mocker in the Cup Psychedelic Rock Version.mp3": 4, "music/Mocker in the Cup Radio.mp3": 5,  "music/Not The Devil I used to Be.mp3": 4, "music/Nylon-String Hallelujah.mp3": 4, "music/Old Warrior at the Water.mp3": 5, "music/Out of the Depths Country Rock (1).mp3": 5, "music/Out of the Depths Country Rock.mp3": 5, "music/Out of the Depths Gospel Soul Worship Ballad.mp3": 3, "music/Overcome in Rest Radio (1).mp3": 3, "music/Overcome in Rest Radio (2).mp3": 4, "music/Overcome in Rest Radio.mp3": 3, "music/Overcome in Rest.mp3": 3, "music/Pain and Pride (1).mp3": 3, "music/Pain and Pride Best.mp3": 5, "music/Pain and Pride.mp3": 3, "music/Pain and Rpride Radio (1).mp3": 3, "music/Pain and Rpride Radio.mp3": 3, "music/Pressing Through the Thorn (Still Sent) (1).mp3": 3, "music/Pressing Through the Thorn (Still Sent).mp3": 3, "music/Proven Armor Radio (1).mp3": 3, "music/Proven Armor Radio edm (1).mp3": 3, "music/Proven Armor Radio edm.mp3": 3, "music/Proven Armor Radio.mp3": 3, "music/Proven Armor.mp3": 4, "music/Quiet Pain.mp3": 3, "music/River-of-Grace-808.mp3": 4, "music/Road Home Mercy.mp3": 4, "music/RUNNING ON EMPTY.mp3": 5, "music/Save My Marriage, Jesus Country Rock.mp3": 3, "music/Selah.mp3": 5, "music/Selaht18 (1).mp3": 3, "music/Selaht18.mp3": 3, "music/Seven Times I Rise Chill.mp3": 3, "music/Seven Times I Rise.mp3": 3, "music/Sippin\u2019 on Grace & Truth  Bounce Drop Country Rap.mp3": 4, "music/Spoken For (1).mp3": 3, "music/Spoken For (euro rave bounce).mp3": 4, "music/Spoken For Refined.mp3": 5, "music/Spoken For t1.mp3": 4, "music/Spoken For.mp3": 3,    "music/Standing in the fire Trance (1).mp3": 2, "music/Standing in the fire Trance.mp3": 3, "music/Step Strong (euro hop).mp3": 3, "music/Still In Your Hands Pop.mp3": 3,      "music/Straped x Fire in My Bones (Mashup)t19 (0.89x)t20.mp3": 3, "music/Straped.mp3": 3, "music/Strapedt18.mp3": 3, "music/Strong and Brave Blues Pop.mp3": 5, "music/Strong and Brave Psychedelic Rock Version (1).mp3": 4, "music/Strong and Brave Psychedelic Rock Version.mp3": 4, "music/Stronger Than the Pain (bass drums).mp3": 5, "music/Stronger Than the Pain ClubMix (1).mp3": 3, "music/Stronger Than the Pain ClubMix.mp3": 3, "music/Stronger than The Pain Tear The Roof  Club Mix (1).mp3": 4, "music/Stronger than The Pain Tear The Roof  Club Mix.mp3": 4, "music/Stronger Than the Pain.mp3": 3, "music/Stronger Than the Paint16 Rap version.mp3": 3, "music/Sweeter Than the Chains Southern Rock (1).mp3": 3, "music/Sweeter Than the Chains Southern Rock.mp3": 3, "music/Sword I Carry Now.mp3": 5, "music/Tear the Roof (1).mp3": 3, "music/Tear the Roof x Stronger Than the Pain (Mashup) (2).mp3": 3, "music/Tear the Roof x Stronger Than the Pain (Mashup).mp3": 3, "music/The Horse and Rider.mp3": 5, "music/The Nitty Gritty Devil Country Rock (1).mp3": 3, "music/The Nitty Gritty Devil Country Rock (2).mp3": 4, "music/The Nitty Gritty Devil Country Rock.mp3": 5, "music/The Rider in the Sky (1).mp3": 3, "music/The Rider in the Sky.mp3": 3, "music/Those nail-scarred hands.mp3": 5, "music/Tongues of Fire  Bounce Drop Country Rap.mp3": 3, "music/Tongues of Fire  Club.mp3": 5, "music/Tryna Stay Awake in Church Bounce Drop Country Rap.mp3": 3, "music/Use this pain.mp3": 3, "music/Valley Nightlight.mp3": 3, "music/Vapor in the Wind (1).mp3": 4, "music/Vapor in the Wind.mp3": 3, "music/Walk it Out.mp3": 3, "music/Walk Upright.mp3": 4, "music/Walk Uprightt13 (1).mp3": 4, "music/Walk Uprightt13.mp3": 4, "music/Walking in di Light.mp3": 5, "music/WITNESS IN THE FIRE (1).mp3": 5, "music/WITNESS IN THE FIRE (2).mp3": 4, "music/WITNESS IN THE FIRE.mp3": 4, "music/You answer when I call (1).mp3": 4, "music/You answer when I call (2).mp3": 4, "music/You answer when I call.mp3": 4, "music/You Hold Mde Up Radio.mp3": 5, "music/You Hold Me Up (1).mp3": 3, "music/You Hold Me Up.mp3": 3, "music/You speak for me.mp3": 3, "music/(Intro _ Build-Up).mp3": 2, "music/\u201cGrace Runs Deep (Like a River) Psychedelic Rock Version (1).mp3": 5, "music/\u201cGrace Runs Deep (Like a River) Psychedelic Rock Version.mp3": 5, "music/\u201cLight Breaks the Chain)\u201d  Blues Jazz (1).mp3": 3, "music/\u201cLight Breaks the Chain)\u201d  Blues Jazz.mp3": 3, "music/Divine-Control.mp3": 4, "music/FRAGILE-HEART-ETERNAL-LIGHT.mp3": 3, "music/He-Is-My-Salvation.mp3": 3, "music/Here-Comes-the-Pain.mp3": 3, "music/Holy Rest (1).mp3": 4, "music/Holy Rest (Freestyle).mp3": 4, "music/Holy Rest R&B JAZZ CHILL.mp3": 3, "music/Holy Rest.mp3": 5, "music/Joyful-Noise.mp3": 5, "music/Lift-my-head.mp3": 5, "music/Midnight Grace (Studio Freestyle Worship) (1).mp3": 4, "music/Midnight Grace (Studio Freestyle Worship) (2).mp3": 3, "music/Midnight Grace (Studio Freestyle Worship) (3).mp3": 4, "music/Midnight Grace (Studio Freestyle Worship).mp3": 3, "music/New Anthem Love.mp3": 3, "music/Stay in Your Love\u201d (Smooth Groove Version)_.mp3": 3, "music/Stay in Your Love\u201d (Smooth Version)_.mp3": 3, "music/Straped-x-Fire-in-My-Bones-Mashup-0-89x.mp3": 3, "music/Stronger-Than-the-Pain-Rap-version.mp3": 2, "music/You Alone Are Holy.mp3": 2, "music/Your Holy Heartbeat Stays (Club Mix).mp3": 2, "music/Your Holy Heartbeat Stays (Concert Mix Smooth).mp3": 3, "music/Your Holy Heartbeat Stays (Concert Mix).mp3": 3,  "music/Still In Your Hands Gospel Soul Worship Ballad.mp3": 0,
"music/You Are My Joy (Dance).mp3": 5,
"music/Hidden in the Shadow of His Wings (LoFi).mp3": 5,
"music/You Are My Joy (LoFi).mp3": 5,
"music/Rose Of Sharron (LoFi).mp3": 5,
"music/Healed by the Hand (Dance).mp3": 5,
"music/HEART OF GLASS, HAND OF GRACE (Dance).mp3": 5,
"music/Grace in Cowboy Boots (Country).mp3": 5,
"music/Give God Your Burden (Country).mp3": 5,
"music/Too Far Gone (Bluegrass).mp3": 5,
"music/Bless Your Name (Bluegrass).mp3": 5,
"music/Bless Your Name (Bluegrass) (2).mp3": 5,
"music/In Your Presence (Bluegrass).mp3": 5,
"music/Bless Your Name (Bluegrass) (1).mp3": 5,
"music/His Mercy Runs Deep (R&B).mp3": 5,
"music/Clothed in Your Glory (R&B).mp3": 5,
"music/His Mercy Runs Deep (R&B) (1).mp3": 5,
"music/LIGHT THAT NEVER FALLS.mp3": 5,
"music/What I Lay at the Altar.mp3": 5,
"music/LIGHT THAT NEVER FALLS (1).mp3": 5,
"music/Light That Never Fails (Worship).mp3": 5,
"music/His Mercy Runs Deep (R&B) (2).mp3": 5,
"music/In Your Presence (Bluegrass) (1).mp3": 5,
"music/Broken By Grace (Country).mp3": 5,
"music/Give God Your Burden (Country) (1).mp3": 5,
"music/Healed by the Hand (Dance) (1).mp3": 5,
"music/You Are My Joy (LoFi) (1).mp3": 5,
"music/Don't You Cry Anymore (1).mp3": 5};
(function(){try{var k='rrn_radio_scores_v2';if(!localStorage.getItem(k)){localStorage.setItem(k,JSON.stringify(RR_SEED_SCORES));}}catch(e){}})();
// Optional station IDs / sweepers played at the top of each hour (skipped if empty, no dead air):
var RR_IMAGING = [
  {title:"Refined Recovery", src:"music/Refined Recovery.mp3"},
];
// Ads / sponsor spots — inserted as commercial breaks every RR_SONGS_PER_BREAK songs:
var RR_ADS = [
  {title:"Refined Radio Intro App", src:"music/REFINED RADIO INTRO APP \u2013 SPOKEN COMMERCIAL (NON-MUSICAL) (1).mp3"},
  {title:"Refined Radio Intro All Programs", src:"music/REFINED RADIO INTRO ALL PROGRAMS\u2013 SPOKEN COMMERCIAL (NON-MUSICAL) (1).mp3"},
  {title:"Refined Radio Ad", src:"music/Refined Radio Ad.mp3"},
  {title:"Beta Tester Invitation", src:"music/Beta Tester Invitation.mp3"},
  {title:"Chariot with Purpose (1)", src:"music/Chariot With Purpose (1).mp3"},
  {title:"Chariot with Purpose (2)", src:"music/Chariot With Purpose (2).mp3"},
  {title:"Chariot with Purpose (3)", src:"music/Chariot With Purpose (3).mp3"},
  {title:"Chariot with Purpose (4)", src:"music/Chariot With Purpose (4).mp3"},
  {title:"Chariot with Purpose (5)", src:"music/Chariot With Purpose (5).mp3"},
  {title:"Chariot with Purpose (6)", src:"music/Chariot With Purpose (6).mp3"},
  {title:"Chariot with Purpose", src:"music/Chariot With Purpose.mp3"},
  {title:"Double Portion Radio", src:"music/Double Portion Radio.mp3"},
  {title:"Encouragement Ad 1", src:"music/Encouragement Ad 1.mp3"},
  {title:"Encouragement Ad 3", src:"music/Encouragement Ad 3.mp3"},
  {title:"Encouragement Ad 4", src:"music/Encouragement Ad 4.mp3"},
  {title:"Encouragement Ad 5", src:"music/Encouragement Ad 5.mp3"},
  {title:"Encouragement Ad 6 (1)", src:"music/Encouragement Ad 6 (1).mp3"},
  {title:"Encouragement Ad 6", src:"music/Encouragement Ad 6.mp3"},
  {title:"Refined Recovery Network", src:"music/Refined Recovery Network.mp3"},
];
// Auto-route breaks: pull commercials + station IDs out of the music rotation
if(!RR_ADS.length){RR_ADS=RR_LIBRARY.filter(function(t){return (t.genre||"").toLowerCase()==="commercial";});}
if(!RR_IMAGING.length){RR_IMAGING=RR_LIBRARY.filter(function(t){var g=(t.genre||"").toLowerCase();return g==="station id"||g==="station-id";});}
var RR_SONGS_PER_BREAK = 3;   // ad-break cadence (matches your radio clock)
// THE CLOCK — which genre pool plays each hour (visitor local time, 24h). Edit freely:
/* ===== Refined Radio programmed clock: dayparts + scheduled specialty inserts ===== */
var RR_DAYPARTS = [
  {s:0, e:6, name:"Healing & Recovery", genres:["praise & worship","contemporary worship","worship rock","christian chillwave","christian blues-jazz","testimony","testimony songs"], spec:""},
  {s:6, e:10, name:"Morning Motivation", genres:["christian pop","southern christian rock","worship rock","christian country","praise & worship"], spec:"bounce"},
  {s:10, e:14, name:"Christian 80s Lunch", genres:["christian pop","southern christian rock","christian country","christian country - pop"], spec:"80s"},
  {s:14, e:17, name:"Workday Encouragement", genres:["christian country","southern christian rock","christian pop","christian soul"], spec:"bounce"},
  {s:17, e:20, name:"Drive Time", genres:["southern christian rock","christian country","christian pop","christian 80's"], spec:""},
  {s:20, e:24, name:"Night Energy", genres:["christian edm","christian dance","christian k-pop","christian trip-hop"], spec:"bounce"}
];
// Scheduled specialty inserts: hour -> {min,type}. Fires once that hour when the clock passes that minute.
var RR_SPECIAL = {
  6:{min:20,type:"bounce"}, 7:{min:40,type:"bounce"}, 8:{min:15,type:"bounce"}, 9:{min:35,type:"bounce"},
  10:{min:30,type:"80s"}, 11:{min:30,type:"80s"}, 12:{min:30,type:"80s"}, 13:{min:30,type:"80s"},
  14:{min:20,type:"bounce"}, 16:{min:20,type:"bounce"},
  21:{min:15,type:"bounce"}, 22:{min:15,type:"bounce"}, 23:{min:15,type:"bounce"}
};
var RR_G_BOUNCE="christian bounce drop", RR_G_80S="christian 80's", RR_G_TEACH="biblical teaching";
function rrDaypart(h){ for(var i=0;i<RR_DAYPARTS.length;i++){var d=RR_DAYPARTS[i]; if(h>=d.s&&h<d.e) return d;} return RR_DAYPARTS[0]; }

var rrA=document.getElementById('rrAudio');
// Gap-free streaming: warm the next track in the browser cache while the current one plays.
var rrPreA=(typeof Audio!=='undefined')?new Audio():null; if(rrPreA){rrPreA.preload='auto';}
var rrPreSrc='', rrPreTimer=null;
// debounced: during rapid skips, only the settled next-track preloads (protects iOS Safari memory)
function rrPreload(){ if(rrPreTimer){clearTimeout(rrPreTimer);} rrPreTimer=setTimeout(function(){ try{ var nx=rrUpNext(); if(nx){ var u=rrUrl(nx._real||nx.src); if(u!==rrPreSrc && rrPreA){ rrPreSrc=u; rrPreA.src=u; rrPreA.load(); } } }catch(e){} },1500); }
var rrPlaying=false, rrCur=null, rrRecent=[], rrHour=-1, rrSongsSinceBreak=0, rrAdIdx=0;
var rrScore=(function(){try{return JSON.parse(localStorage.getItem('rrn_radio_scores_v2')||'{}');}catch(e){return {};}})();
function rrSave(){try{localStorage.setItem('rrn_radio_scores_v2',JSON.stringify(rrScore));}catch(e){}}
function rrWeight(t){var s=rrScore[t.src]||0;return Math.max(0.05,Math.pow(1.7,s));}
function rrFormat(){var d=rrDaypart(new Date().getHours());return {label:d.name};}
var rrBag=[];
var rrForcedGenre="";
var RR_API="https://rrn-api-production.up.railway.app";
var rrVid=(function(){try{var v=localStorage.getItem("rrn_vid");if(!v){v="v"+Date.now().toString(36)+Math.random().toString(36).slice(2,8);localStorage.setItem("rrn_vid",v);}return v;}catch(e){return "anon";}})();
// ATTRIBUTION: where did this listener come from? First-touch wins, stored per browser.
var rrSource=(function(){
  try{
    var u=new URLSearchParams(location.search);
    var s=(u.get("source")||u.get("utm_source")||u.get("ref")||"").toLowerCase();
    if(!s){ var r=document.referrer||"";
      if(/facebook|fb\.me|fb\.com/.test(r)) s="facebook";
      else if(/t\.me|telegram/.test(r)) s="telegram";
      else if(/twitter|x\.com|t\.co/.test(r)) s="x";
      else if(/linkedin|lnkd/.test(r)) s="linkedin";
      else if(/google|bing|duckduckgo|yahoo/.test(r)) s="google";
      else if(/mail|gmail|outlook/.test(r)) s="email";
      else if(r) s="referral"; else s="direct";
    }
    s=s.replace(/[^a-z0-9_]/g,"").slice(0,32)||"direct";
    var saved=localStorage.getItem("rrn_source");
    if(!saved){ localStorage.setItem("rrn_source",s); return s; }
    return saved;
  }catch(e){ return "direct"; }
})();
// encode each path segment so filenames with spaces/quotes/&/commas resolve on GitHub Pages
function rrEnc(s){if(!s)return s;return /^(blob:|https?:|data:)/.test(s)?s:s.split("/").map(encodeURIComponent).join("/");}
// AUDIO HOST: leave RR_CDN empty to stream from the site's own music/ folder (GitHub Pages),
// or set it to your object-store / CDN base (e.g. "https://pub-xxxx.r2.dev/") to stream from there.
// Switching hosts is this ONE line — every track follows it.
var RR_CDN="";
function rrUrl(s){ if(!s) return s; if(/^(blob:|https?:|data:)/.test(s)) return s; var enc=s.split("/").map(encodeURIComponent).join("/"); return RR_CDN ? (RR_CDN.replace(/\/+$/,"")+"/"+enc) : enc; }
// CROSS-LISTENER POPULARITY: pull pooled scores so everyone's votes count
function rrLoadScores(){try{fetch(RR_API+"/api/radio/scores").then(function(r){return r.json();}).then(function(d){if(d&&d.scores){for(var k in d.scores){rrScore[k]=d.scores[k];}rrSave();if(rrCur)rrPaint();}rrRenderLoved();}).catch(function(){});}catch(e){}}
function rrFillGenres(){var sel=document.getElementById("rrGenre");if(!sel)return;var cats=[];rrSongListAll().forEach(function(t){var g=(t.genre||"").trim();if(g&&cats.indexOf(g)<0)cats.push(g);});cats.sort();cats.forEach(function(g){var o=document.createElement("option");o.value=g.toLowerCase();o.textContent=g.replace(/\b\w/g,function(c){return c.toUpperCase();});sel.appendChild(o);});}
function rrSetGenre(g){rrForcedGenre=(g||"").toLowerCase();rrBag=[];rrAdvance();}
function rrSongListAll(){ // every playable song (commercials, station IDs, teaching excluded)
  return RR_LIBRARY.filter(function(t){var g=(t.genre||"").toLowerCase();return g!=="commercial"&&g!=="station id"&&g!=="station-id"&&g!==RR_G_TEACH;});
}
function rrSongList(){ // PLAY-ALL: every song is always eligible, so the whole catalog is heard at any hour
  var all=rrSongListAll();
  if(rrForcedGenre) return all.filter(function(t){return (t.genre||"").toLowerCase()===rrForcedGenre;});
  var pool=all.filter(function(t){ return (t.genre||"").toLowerCase()!==RR_G_BOUNCE; }); // bounce drops sprinkle in via the specialty path
  return pool.length?pool:all;
}
var _rrAllDp=null;
function rrAllDpGenres(){ if(_rrAllDp)return _rrAllDp; var s={}; RR_DAYPARTS.forEach(function(d){(d.genres||[]).forEach(function(g){s[g]=1;});}); _rrAllDp=Object.keys(s); return _rrAllDp; }
function rrShuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function rrPool(){return rrSongList();} // kept for compatibility
// ===== PLAY-ALL ROTATION + 2-HOUR SONG-FAMILY COOLDOWN =====
var rrFamLast={};                      // famKey -> ms timestamp last played
var RR_COOLDOWN_MS=2*60*60*1000;       // no version of a song repeats within 2 hours
function rrFamKey(t){ var s=((t&&(t.title||t.src))||"").toLowerCase().replace(/\.(mp3|wav|m4a|ogg|flac)$/,"");
  s=s.split("\u2014")[0].split(/\s-\s/)[0]; var p; do{p=s;s=s.replace(/\s*\([^)]*\)\s*$/,"").trim();}while(p!==s);
  return s.replace(/\s*(?:v\d+|mix\s*\d+|version\s*\d+)\s*$/i,"").replace(/[^a-z0-9]+/g,""); }
function rrPlaysFor(t){ return 1; }     // EVERY song gets exactly one slot -> the whole library plays before anything repeats
function rrBuildBag(){ return rrShuffle(rrSongList().slice()); } // one copy of every eligible song, shuffled
// Pop from the bag, skipping any Song Family played within the last 2 hours; if all are on cooldown, play the longest-idle.
function rrPick(){
  if(!rrBag.length){ rrBag=rrBuildBag(); }
  if(!rrBag.length) return null;
  var now=Date.now(), tries=rrBag.length;
  while(tries-- > 0){
    var t=rrBag.pop(); if(!t) break;
    var lp=rrFamLast[rrFamKey(t)];
    if(lp==null || (now-lp)>=RR_COOLDOWN_MS){
      if(rrCur && t.src===rrCur.src && rrBag.length){ rrBag.unshift(t); continue; } // no immediate same-song repeat
      return t;
    }
    rrBag.unshift(t); // family still cooling down -> send to front, try the next song
  }
  // pool too small to honor the full 2h window: play the family idle the longest
  var bi=-1, bt=Infinity;
  for(var i=0;i<rrBag.length;i++){ var v=rrFamLast[rrFamKey(rrBag[i])]; v=(v==null?-1:v); if(v<bt){bt=v;bi=i;} }
  return bi>=0 ? rrBag.splice(bi,1)[0] : (rrBag.length?rrBag.pop():null);
}
function rrUpNext(){ if(!rrBag.length) rrBag=rrBuildBag(); return rrBag.length?rrBag[rrBag.length-1]:null; }
function rrPlayTrack(t){
  if(!t)return; rrCur=t; try{rrFamLast[rrFamKey(t)]=Date.now();}catch(_e){} rrA.src=rrUrl(t._real||t.src);
  document.getElementById('rrTitle').textContent=t.title||'Refined Radio';
  var rrNx=rrUpNext();document.getElementById('rrSub').textContent=(t.artist?t.artist+' \u00b7 ':'')+rrFormat().label+(rrNx?' \u00b7 Next: '+rrNx.title:'');
  rrRecent.push(t.src); var cap=Math.min(4,Math.max(1,rrPool().length-1)); while(rrRecent.length>cap)rrRecent.shift();
  rrNowCard(t); rrEvent('start'); rrPaint(); rrA.play().catch(function(){}); rrPreload();
}
// --- programmed-clock helpers ---
var rrHourDone={}, rrTeachIdx=0;
function rrByGenre(g){ g=(g||"").toLowerCase(); return RR_LIBRARY.filter(function(t){return (t.genre||"").toLowerCase()===g;}); }
function rrWeightedPick(list){ if(!list||!list.length) return null; var bag=[]; list.forEach(function(t){var n=rrPlaysFor(t);for(var i=0;i<n;i++)bag.push(t);}); if(!bag.length)bag=list.slice(); return bag[Math.floor(Math.random()*bag.length)]; }
function rrPlayClip(obj,label){ if(!obj) return false; rrCur=null; rrA.src=rrUrl(obj._real||obj.src);
  document.getElementById('rrTitle').textContent=obj.title||label; rrNowCard(null,label);
  document.getElementById('rrSub').textContent=label; rrPaint(); rrA.play().catch(function(){}); rrPreload(); return true; }
function rrStationID(){ if(!RR_IMAGING.length) return false; return rrPlayClip(RR_IMAGING[Math.floor(Math.random()*RR_IMAGING.length)],'Station ID'); }
function rrFeatured(){ // top-of-hour featured: top-rated within the current daypart
  var pool=rrSongList().filter(function(t){return (rrScore[t.src]||0)>=4;});
  if(!pool.length) pool=rrSongList().filter(function(t){return (rrScore[t.src]||0)>=3;});
  var t=rrWeightedPick(pool); if(!t) return false; rrSongsSinceBreak=0; rrPlayTrack(t); return true; }
function rrSpecialty(type){ var t=rrWeightedPick(rrByGenre(type==="80s"?RR_G_80S:RR_G_BOUNCE)); if(!t) return false; rrSongsSinceBreak=0; rrPlayTrack(t); return true; }
function rrTeaching(){ var list=rrByGenre(RR_G_TEACH); if(!list.length) return false; var t=list[rrTeachIdx%list.length]; rrTeachIdx++; return rrPlayClip(t,'Biblical Teaching'); }
// --- rating feedback: floating confirm + button/star pop ---
function rrFloat(sym,which){ try{
  var btn=document.getElementById(which==='down'?'rrDn':(which==='up'?'rrUp':'rrPP'))||document.getElementById('rrPP');
  var r=btn?btn.getBoundingClientRect():{left:(window.innerWidth/2),top:(window.innerHeight-120),width:28};
  for(var i=0;i<3;i++){(function(i){setTimeout(function(){
    var el=document.createElement('div'); el.className='rr-float'; el.textContent=sym;
    el.style.left=(r.left+r.width/2-13+(Math.random()*34-17))+'px';
    el.style.top=(r.top-8)+'px';
    document.body.appendChild(el); setTimeout(function(){ if(el&&el.parentNode) el.parentNode.removeChild(el); },1000);
  },i*95);})(i); }
  if(btn){ btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
}catch(e){} }
function rrStarBump(){ var se=document.getElementById('rrStars'); if(se){ se.classList.remove('rr-star-pulse'); void se.offsetWidth; se.classList.add('rr-star-pulse'); } }
// tap a star to set the rating directly
function rrSetStars(n){ if(!rrCur)return; var tk=rrCur.src; rrScore[tk]=Math.max(0,Math.min(5,n)); rrSave(); rrPaint(); rrStarBump(); rrFloat('\u2B50','up'); rrEvent('rate',tk);
  try{ fetch(RR_API+"/api/radio/rate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({voter:rrVid,track:tk,set:rrScore[tk]})}).catch(function(){}); }catch(e){}
  rrRenderLoved(); rrMaybeAskEmail(); if(rrCur)rrNowCard(rrCur); }
// --- capture listener email after they rate (non-blocking, one-time) ---
function rrMaybeAskEmail(){ try{
  if(localStorage.getItem('rrn_listener_email')||localStorage.getItem('rrn_email_ask_done')) return;
  if(document.getElementById('rrEmailBar')) return;
  var bar=document.createElement('div'); bar.id='rrEmailBar'; bar.className='rr-emailbar';
  bar.innerHTML='<span>Want alerts when new songs &amp; teaching drop?</span>'+
    '<input id="rrEmailInp" type="email" placeholder="your email" aria-label="Email for new music alerts">'+
    '<button onclick="rrSaveEmail()">Notify me</button>'+
    '<button class="rr-em-x" onclick="rrDismissEmail()" aria-label="Dismiss">\u00d7</button>';
  var host=document.querySelector('#rrPlayer .rrp-bar')||document.getElementById('rrPlayer')||document.body; host.appendChild(bar);
}catch(e){} }
function rrSaveEmail(){ var inp=document.getElementById('rrEmailInp'); var e=(inp&&inp.value||'').trim();
  if(!e||e.indexOf('@')<1){ if(inp)inp.style.borderColor='#e06a6a'; return; }
  try{ localStorage.setItem('rrn_listener_email',e); localStorage.setItem('rrn_email_ask_done','1'); }catch(_){}
  if(window.rrnIntake) window.rrnIntake('radio_listener',{email:e,payload:{source:(typeof rrSource!=='undefined'?rrSource:'direct'),location:'refined_radio_rating',last_song:(rrCur?rrCur.title:'')}});
  rrEvent('email','radio'); var b=document.getElementById('rrEmailBar'); if(b){ b.innerHTML='<span>You\u2019re on the list \u2014 thank you!</span>'; setTimeout(function(){ var x=document.getElementById('rrEmailBar'); if(x&&x.parentNode)x.parentNode.removeChild(x); },2500); } }
function rrDismissEmail(){ try{ localStorage.setItem('rrn_email_ask_done','1'); }catch(_){} var b=document.getElementById('rrEmailBar'); if(b&&b.parentNode)b.parentNode.removeChild(b); }
// --- 30-second preview when arriving from a shared song link (?preview=Title) ---
var rrPreviewTimer=null;
function rrCheckPreview(){ try{
  var u=new URLSearchParams(location.search); var q=u.get('preview'); if(!q) return;
  var want=decodeURIComponent(q).trim().toLowerCase(); var t=null;
  for(var i=0;i<RR_LIBRARY.length;i++){ if((RR_LIBRARY[i].title||'').trim().toLowerCase()===want){ t=RR_LIBRARY[i]; break; } }
  if(!t) return;
  var pl=document.getElementById('rrPlayer'); if(pl) pl.classList.add('rrShow');
  rrForcedGenre=''; rrCur=t; rrA.src=rrUrl(t._real||t.src);
  document.getElementById('rrTitle').textContent='\u25B6 '+t.title+' \u2014 30-second preview';
  document.getElementById('rrSub').textContent='Preview \u00b7 tap play to hear the full song live';
  rrNowCard(t); rrPaint();
  if(rrPreviewTimer){clearTimeout(rrPreviewTimer);}
  rrA.play().then(function(){ rrPreviewTimer=setTimeout(function(){ try{rrA.pause();}catch(e){}
    document.getElementById('rrTitle').textContent='Hear the full song \u2014 Refined Radio is live now';
    document.getElementById('rrSub').textContent='Tap play to keep listening'; }, 30000);
  }).catch(function(){});
}catch(e){} }
// short inspirational / teaching clip between songs (encouragement)
function rrEncouragement(){
  var list=RR_LIBRARY.filter(function(t){var g=(t.genre||'').toLowerCase();return g==='biblical teaching'||g==='testimony'||g==='testimony songs';});
  var t=rrWeightedPick(list); if(!t) return false; return rrPlayClip(t,'Refined Recovery');
}
// rotates Station ID -> Encouragement -> Ad so listeners hear all three over time
var rrBreakIdx=0, rrNextBreakAt=4;
function rrBreakElement(){
  var order=['id','enc','ad'], kind=order[rrBreakIdx%order.length]; rrBreakIdx++;
  if(kind==='id'  && rrStationID()) return true;
  if(kind==='enc' && rrEncouragement()) return true;
  if(kind==='ad'  && RR_ADS.length){ var ad=RR_ADS[rrAdIdx%RR_ADS.length]; rrAdIdx++; if(rrPlayClip(ad,'Sponsor message')) return true; }
  if(rrStationID()) return true; if(rrEncouragement()) return true; // fallback if chosen kind is empty
  return false;
}
function rrAdvance(){
  var now=new Date(), h=now.getHours(), m=now.getMinutes();
  if(h!==rrHour){ rrHour=h; rrHourDone={}; rrBag=[]; } // new hour: reset clock + rebuild daypart pool
  var dp=rrDaypart(h);
  // :00  station ID, then featured top-rated song
  if(!rrHourDone.id0 && m<2){ rrHourDone.id0=1; if(rrStationID()) return; }
  if(!rrHourDone.feat){ rrHourDone.feat=1; if(rrFeatured()) return; }
  // :55  teaching segment (never mixed into the music rotation)
  if(!rrHourDone.teach && m>=55){ rrHourDone.teach=1; if(rrTeaching()) return; }
  // :59  close-of-hour station ID
  if(!rrHourDone.id59 && m>=59){ rrHourDone.id59=1; if(rrStationID()) return; }
  // scheduled specialty insert at your set minute
  var sp=RR_SPECIAL[h];
  if(sp && !rrForcedGenre && !rrHourDone.spec && m>=sp.min){ rrHourDone.spec=1; if(rrSpecialty(sp.type)) return; }
  // station ID / encouragement / ad every 3-5 songs (rotating)
  if(rrSongsSinceBreak>=rrNextBreakAt){ rrSongsSinceBreak=0; rrNextBreakAt=3+Math.floor(Math.random()*3); if(rrBreakElement()) return; }
  // sprinkle bounce-drop comedy / Christian 80s through the music
  if(!rrForcedGenre && Math.random()<0.14){ var k=Math.random()<0.6?'bounce':'80s'; if(rrSpecialty(k)){ rrSongsSinceBreak++; return; } }
  // regular rotation within the current daypart, rating-weighted
  rrSongsSinceBreak++; rrPlayTrack(rrPick());
}
function rrToggle(){
  if(!RR_LIBRARY.length){document.getElementById('rrTitle').textContent='No songs loaded yet \u2014 add tracks to the RR_LIBRARY list';document.getElementById('rrPlayer').classList.add('rrShow');return;}
  if(!rrA.src){rrAdvance();return;}
  if(rrPlaying)rrA.pause(); else rrA.play().catch(function(){});
}
function rrNext(){ if(RR_LIBRARY.length){ if(rrCur)rrEvent('skip'); rrAdvance(); } }
function rrPrev(){ if(RR_LIBRARY.length)rrAdvance(); }
function rrVol(v){rrA.volume=parseFloat(v);}
function rrSeek(e){if(!rrA.duration)return;var r=document.getElementById('rrProg').getBoundingClientRect();rrA.currentTime=((e.clientX-r.left)/r.width)*rrA.duration;}
function rrRate(d){if(!rrCur)return;var tk=rrCur.src;var s=(rrScore[tk]||0)+d;s=Math.max(-3,Math.min(5,s));rrScore[tk]=s;rrSave();rrPaint();rrStarBump();rrFloat(d>0?"\uD83D\uDC4D":"\uD83D\uDC4E",d>0?"up":"down");rrEvent(d>0?"like":"dislike");try{fetch(RR_API+"/api/radio/rate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({voter:rrVid,track:tk,delta:d})}).then(function(r){return r.json();}).then(function(res){if(res&&typeof res.score==="number"){rrScore[res.track||tk]=res.score;rrSave();if(rrCur&&rrCur.src===tk)rrPaint();}}).catch(function(){});}catch(e){}rrRenderLoved();rrMaybeAskEmail();if(rrCur)rrNowCard(rrCur);}
function rrPaint(){var up=document.getElementById('rrUp'),dn=document.getElementById('rrDn');var s=rrCur?(rrScore[rrCur.src]||0):0;if(up)up.classList.toggle('on',s>0);if(dn)dn.classList.toggle('on',s<0);var sc=Math.max(0,Math.min(5,s));var se=document.getElementById('rrStars');if(se){var html='';for(var k=0;k<5;k++){html+='<span class="rr-star" role="button" tabindex="0" aria-label="Rate '+(k+1)+' star" onclick="rrSetStars('+(k+1)+')">'+(k<sc?'\u2605':'\u2606')+'</span>';}se.innerHTML=html;}}
var rrReqMap=(function(){try{return JSON.parse(localStorage.getItem('rrn_requests')||'{}');}catch(e){return {};}})();
// EVENT TRACKING: start / complete / skip / like / dislike / request / share
function rrEvent(type,track){ try{ var tk=track||(rrCur?rrCur.src:'station'); fetch(RR_API+"/api/radio/event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({voter:rrVid,track:tk,type:type,source:rrSource})}).catch(function(){}); }catch(e){} }
function rrRequest(){
  if(!rrCur) return;
  rrReqMap[rrCur.src]=(rrReqMap[rrCur.src]||0)+1;
  try{ localStorage.setItem('rrn_requests',JSON.stringify(rrReqMap)); }catch(e){}
  rrEvent('request'); if(window.rrToast)rrToast('Requested \u2014 boosting this song'); if(window.rrFloat)rrFloat('\u2708\ufe0f','up'); rrNowCard(rrCur); rrRenderLoved();
  var b=document.getElementById('rrReq'); if(b){ b.classList.add('on'); setTimeout(function(){b.classList.remove('on');},1000); }
}
function rrShareLink(msg,base){
  if(navigator.share){ navigator.share({title:"Refined Recovery Network Radio",text:msg,url:base}).catch(function(){}); }
  else { window.open("https://www.facebook.com/sharer/sharer.php?u="+encodeURIComponent(base),"_blank","noopener"); }
}
function rrShareSong(){ rrEvent("share"); if(window.rrOpenShare) rrOpenShare(); }
function rrNowCard(t,label){
  var T=document.getElementById('np-title'); if(!T) return;
  if(label){ T.textContent=label; document.getElementById('np-artist').textContent=''; document.getElementById('np-stars').textContent=''; document.getElementById('np-likes').textContent=''; }
  else if(t){
    T.textContent=t.title||'Refined Radio';
    document.getElementById('np-artist').textContent=t.artist||'RRN';
    var s=Math.max(0,Math.min(5,rrScore[t.src]||0)),st=''; for(var k=0;k<5;k++)st+=(k<s?'\u2605':'\u2606');
    document.getElementById('np-stars').textContent=st;
    var sc=rrScore[t.src]||0;
    var rq=rrReqMap[t.src]||0;var parts=[];if(sc>0)parts.push('\u2764\uFE0F '+sc+' like'+(sc===1?'':'s'));if(rq>0)parts.push('\uD83C\uDFB5 '+rq+' request'+(rq===1?'':'s'));document.getElementById('np-likes').textContent=parts.join('  \u00b7  ');
  } else { T.textContent='Press play to begin'; document.getElementById('np-artist').textContent=''; document.getElementById('np-stars').textContent=''; document.getElementById('np-likes').textContent=''; }
  var nx=rrUpNext(); var N=document.getElementById('np-next'); if(N)N.textContent=nx?nx.title:'\u2014';
}
var rrBoardCache={}, rrBoardLoading={}, rrCurTab='trending';
var RR_TABS={
  trending: {days:2,   sort:'popularity', metric:'pop'},
  week:     {days:7,   sort:'popularity', metric:'pop'},
  month:    {days:30,  sort:'popularity', metric:'pop'},
  requested:{days:30,  sort:'requests',   metric:'req'},
  shared:   {days:30,  sort:'shares',     metric:'shr'},
  rising:   {days:30,  sort:'popularity', metric:'new', risingOnly:true},
  recent:   {days:3650,sort:'first_seen', metric:'date'}
};
function rrSongBySrc(src){ for(var i=0;i<RR_LIBRARY.length;i++){ if(RR_LIBRARY[i].src===src) return RR_LIBRARY[i]; } return null; }
function rrPrettySrc(s){ try{ s=decodeURIComponent(s); }catch(e){} return (s||'').replace(/^.*\//,'').replace(/\.[^.]+$/,'').replace(/_+/g,' '); }
function renderLocalLoved(el){
  var list=rrSongListAll().filter(function(t){return (rrScore[t.src]||0)>0;})
    .sort(function(a,b){return (rrScore[b.src]||0)-(rrScore[a.src]||0);}).slice(0,12);
  if(!list.length){ el.innerHTML='<li class="rad-empty">No votes yet \u2014 tap \uD83D\uDC4D on the player and songs climb here.</li>'; return; }
  el.innerHTML=list.map(function(t,i){
    var s=Math.max(0,Math.min(5,rrScore[t.src]||0)),st=''; for(var k=0;k<5;k++)st+=(k<s?'\u2605':'\u2606');
    return '<li><span class="rad-rank">'+(i+1)+'</span><span class="rad-song"><span class="rad-t">'+bkEsc(t.title)+'</span><span class="rad-a">'+bkEsc(t.artist||'RRN')+'</span></span><span class="rad-stars">'+st+'</span></li>';
  }).join('');
}
function rrLoadBoardFor(days){
  if(rrBoardLoading[days]) return; rrBoardLoading[days]=true;
  fetch(RR_API+'/api/radio/board?days='+days).then(function(r){return r.json();}).then(function(d){
    rrBoardLoading[days]=false;
    if(d&&d.tracks){ rrBoardCache[days]=d.tracks; if((RR_TABS[rrCurTab]||{}).days===days) rrRenderBoard(); }
  }).catch(function(){ rrBoardLoading[days]=false; });
}
function rrBadge(r,metric){
  if(metric==='req')  return '\uD83C\uDFB5 '+(r.requests||0);
  if(metric==='shr')  return '\u2197 '+(r.shares||0);
  if(metric==='new')  return '<span style="color:var(--gold);font-weight:700;">NEW</span>';
  if(metric==='date'){ var dt=r.first_seen?new Date(r.first_seen):null; return dt?((dt.getMonth()+1)+'/'+dt.getDate()):''; }
  return '\uD83D\uDD25 '+(r.popularity||0);
}
function rrHash(s){ s=s||''; var h=0; for(var i=0;i<s.length;i++){ h=(h*31+s.charCodeAt(i))>>>0; } return h; }
function rrRating(t){ return (rrScore[t.src]||0) || (typeof RR_SEED_SCORES!=='undefined'?(RR_SEED_SCORES[t.src]||0):0); }
// Per-tab local chart so the tabs show genuinely different lists even before backend data exists
function rrRenderLocalChart(el){
  var tab=rrCurTab, all=rrSongListAll(), rows;
  function sc(t){
    var base=rrRating(t), h=rrHash(t.title||t.src);
    if(tab==='requested') return base*100+(h%70);
    if(tab==='shared')    return base*100+((h>>3)%70);
    if(tab==='week')      return base*100+((h>>5)%40);
    if(tab==='month')     return base*100+((h>>7)%55);
    if(tab==='trending')  return base*100+((h>>2)%30)+(t.isNew?25:0);
    return base*100+(h%50);
  }
  if(tab==='rising'){ rows=all.filter(function(t){return t.isNew;}); rows.sort(function(a,b){return sc(b)-sc(a);}); }
  else if(tab==='recent'){ rows=all.filter(function(t){return t.isNew;}); if(rows.length<8) rows=all.slice(); rows=rows.slice().reverse(); }
  else { rows=all.slice().sort(function(a,b){return sc(b)-sc(a);}); }
  rows=rows.slice(0,12);
  if(!rows.length){ el.innerHTML='<li class="rad-empty">No songs in this chart yet.</li>'; return; }
  el.innerHTML=rows.map(function(t,i){
    var s=Math.max(0,Math.min(5,Math.round(rrRating(t)))),st='';
    for(var k=0;k<5;k++)st+=(k<s?'\u2605':'\u2606');
    return '<li><span class="rad-rank">'+(i+1)+'</span><span class="rad-song"><span class="rad-t">'+bkEsc(t.title)+'</span><span class="rad-a">'+bkEsc(t.artist||'RRN')+'</span></span><span class="rad-stars">'+st+'</span></li>';
  }).join('');
}
function rrRenderBoard(){
  var el=document.getElementById('rr-loved'); if(!el) return;
  var cfg=RR_TABS[rrCurTab]||RR_TABS.trending;
  var data=rrBoardCache[cfg.days];
  if(!data){ rrLoadBoardFor(cfg.days); rrRenderLocalChart(el); return; }
  var rows=data.slice();
  if(cfg.risingOnly){ var cut=Date.now()-30*864e5; rows=rows.filter(function(r){return r.first_seen && new Date(r.first_seen).getTime()>=cut;}); }
  rows.sort(function(a,b){ if(cfg.sort==='first_seen') return new Date(b.first_seen||0)-new Date(a.first_seen||0); return (b[cfg.sort]||0)-(a[cfg.sort]||0); });
  if(cfg.sort!=='first_seen'){ rows=rows.filter(function(r){return (r[cfg.sort]||0)>0;}); }
  rows=rows.slice(0,12);
  if(!rows.length){ el.innerHTML='<li class="rad-empty">No data for this chart yet \u2014 it fills in as listeners interact.</li>'; return; }
  el.innerHTML=rows.map(function(r,i){
    var sg=rrSongBySrc(r.track); var title=sg?sg.title:rrPrettySrc(r.track); var artist=sg?(sg.artist||'RRN'):'RRN';
    return '<li><span class="rad-rank">'+(i+1)+'</span><span class="rad-song"><span class="rad-t">'+bkEsc(title)+'</span><span class="rad-a">'+bkEsc(artist)+'</span></span><span class="rad-stars">'+rrBadge(r,cfg.metric)+'</span></li>';
  }).join('');
}
function rrTab(tab){
  if(!RR_TABS[tab]) return; rrCurTab=tab;
  var btns=document.querySelectorAll('#rr-tabs button');
  for(var i=0;i<btns.length;i++){ btns[i].classList.toggle('rt-on', btns[i].getAttribute('data-tab')===tab); }
  rrRenderBoard();
}
function rrRenderLoved(){ rrRenderBoard(); }
function radEmail(){
  var n=(document.getElementById('rad-em-name').value||'').trim();
  var e=(document.getElementById('rad-em-email').value||'').trim();
  var app=document.getElementById('rad-em-app').checked;
  var ok=document.getElementById('rad-em-ok');
  if(!e||e.indexOf('@')<1){ ok.textContent='Please enter a valid email.'; return; }
  if(window.rrnIntake) window.rrnIntake('radio_email',{full_name:n,email:e,payload:{recovery_app_updates:app,source:rrSource,location:'refined_radio'}});
  rrEvent('email','site');
  ok.textContent='You\u2019re on the list \u2014 thank you!';
  document.getElementById('rad-em-name').value=''; document.getElementById('rad-em-email').value='';
}
function radWaitlist(){
  var n=(document.getElementById('rad-wl-name').value||'').trim();
  var e=(document.getElementById('rad-wl-email').value||'').trim();
  var ok=document.getElementById('rad-wl-ok');
  if(!e||e.indexOf('@')<1){ ok.textContent='Please enter a valid email.'; return; }
  if(window.rrnIntake) window.rrnIntake('recovery_app_waitlist',{full_name:n,email:e,payload:{source:rrSource,location:'refined_radio'}});
  rrEvent('waitlist','site');
  ok.textContent='You\u2019re on the early-access list \u2014 we\u2019ll be in touch!';
  document.getElementById('rad-wl-name').value=''; document.getElementById('rad-wl-email').value='';
}
rrA.addEventListener('play',function(){rrPlaying=true;document.getElementById('rrIcon').innerHTML='<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>';});
rrA.addEventListener('pause',function(){rrPlaying=false;document.getElementById('rrIcon').innerHTML='<path d="M8 5v14l11-7z"/>';});
rrA.addEventListener('ended',function(){if(rrCur)rrEvent('complete');rrAdvance();});
/* auto-skip a track whose mp3 is missing/unreadable so the station never freezes */
var rrFailStreak=0;
rrA.addEventListener('error',function(){rrFailStreak++;var total=RR_LIBRARY.length+RR_ADS.length+RR_IMAGING.length;if(rrFailStreak<=total+2){rrAdvance();}else{var T=document.getElementById('rrTitle');if(T)T.textContent='\u26A0 No audio found';var S=document.getElementById('rrSub');if(S)S.textContent='Upload the music/ folder \u2014 filenames must match the playlist';var N=document.getElementById('np-title');if(N)N.textContent='No audio found';var NA=document.getElementById('np-artist');if(NA)NA.textContent='Check the music/ folder';rrPlaying=false;var I=document.getElementById('rrIcon');if(I)I.innerHTML='<path d="M8 5v14l11-7z"/>';}});
rrA.addEventListener('playing',function(){rrFailStreak=0;});
rrA.addEventListener('timeupdate',function(){if(rrA.duration)document.getElementById('rrFill').style.width=(rrA.currentTime/rrA.duration*100)+'%';});
rrA.volume=0.8;
/* ==== Refined Radio path resolver ====
   The playlist is written as flat paths (music/<file>.mp3) for simple uploads,
   but mp3s were uploaded into batch subfolders (music/BatchNNN/<file>.mp3) and
   genre folders. This makes ONE GitHub tree call, finds where each track really
   lives by filename, and points playback at the real file. Ratings/votes stay on
   the original flat key. If the call fails (offline/rate-limited), playback falls
   back to the flat path unchanged. New batches you upload resolve automatically. */
function rrResolveRealPaths(done){
  function fin(){ try{ if(done) done(); }catch(e){} }
  var to=setTimeout(fin,7000);
  function base(s){ return (s||'').split('/').pop(); }
  function norm(s){ return base(s).replace(/\.mp3$/i,'').replace(/[^a-z0-9]+/gi,'').toLowerCase(); }
  function basenorm(s){ return norm(s).replace(/\d+$/,''); }   // strip trailing (1)/(2) duplicate-number so playlist matches repo regardless of suffix
  var RR_ABS="https://chuckb4.github.io/rrn-website/";   // stream audio from the LIVE repo so it plays even when index.html is opened locally
  try{
    fetch("https://api.github.com/repos/ChuckB4/rrn-website/git/trees/main?recursive=1",{headers:{Accept:"application/vnd.github+json"}})
    .then(function(r){ return (r&&r.ok)?r.json():null; })
    .then(function(d){
      var report={ok:false,categories:{}};
      try{
        if(d&&d.tree&&d.tree.length){
          var exact={}, normM={}, baseM={}, files=0;
          for(var i=0;i<d.tree.length;i++){
            var e=d.tree[i]; var pth=(e&&e.path)||"";
            if(e.type==='blob' && /^music\/.+\.mp3$/i.test(pth)){ files++;
              var b=base(pth), n=norm(pth), bn=basenorm(pth);
              if(exact[b]===undefined) exact[b]=pth;   // first match wins
              if(normM[n]===undefined) normM[n]=pth;
              if(bn && baseM[bn]===undefined) baseM[bn]=pth;
            }
          }
          function resolveList(list,label,nameKey){
            var hit=0, fails=[];
            for(var k=0;k<list.length;k++){
              var t=list[k];
              var real=exact[base(t.src)] || normM[norm(t.src)] || baseM[basenorm(t.src)];
              if(real){ t._real=encodeURI(RR_ABS+real); hit++; }
              else { fails.push(((t[nameKey]||base(t.src))+"  [file: "+base(t.src)+"]")); }
            }
            report.categories[label]={total:list.length,resolved:hit,failed:fails.length,failedItems:fails};
            return hit;
          }
          resolveList(RR_LIBRARY,'Songs','title');
          resolveList(RR_ADS,'Commercials (ads)','title');     // <-- ads now resolved too
          resolveList(RR_IMAGING,'Station IDs','title');        // <-- station IDs too
          report.ok=true; report.filesInRepo=files;
          rrBag=[]; // rebuild rotation now that real paths are known
          var c=report.categories;
          try{ console.log("[Refined Radio] resolved \u2014 Songs "+c['Songs'].resolved+"/"+c['Songs'].total+
            ", Ads "+c['Commercials (ads)'].resolved+"/"+c['Commercials (ads)'].total+
            ", IDs "+c['Station IDs'].resolved+"/"+c['Station IDs'].total+
            "  ("+files+" mp3s in repo). Run rrValidate() in this console for the full per-track report."); }catch(_){}
        } else {
          try{ console.warn("[Refined Radio] repo tree did not load (GitHub API limit or offline) \u2014 streaming flat music/ paths from the live repo."); }catch(_){}
          try{ [RR_LIBRARY,RR_ADS,RR_IMAGING].forEach(function(L){ for(var i=0;i<L.length;i++){ if(!L[i]._real) L[i]._real=encodeURI(RR_ABS+L[i].src); } }); }catch(_e){}
        }
      }catch(e){}
      window.RR_RESOLVE_REPORT=report;
      clearTimeout(to); fin();
    })
    .catch(function(){ clearTimeout(to); fin(); });
  }catch(e){ clearTimeout(to); fin(); }
}
// Deterministic manifest validator: prints exactly which assets will and will not play, per category.
window.rrValidate=function(){
  var r=window.RR_RESOLVE_REPORT;
  if(!r||!r.ok){ console.log("Resolver has not finished (or the repo tree did not load). Reload, wait ~3 seconds, then run rrValidate() again."); return r; }
  console.log("%c=== Refined Radio Manifest Validator ===","font-weight:bold;font-size:13px");
  console.log(r.filesInRepo+" mp3 files found in /music");
  Object.keys(r.categories).forEach(function(cat){
    var c=r.categories[cat];
    console.log("\n"+cat+": "+c.resolved+" / "+c.total+" WILL PLAY"+(c.failed?("   \u2014 "+c.failed+" WILL NOT PLAY (file not found in /music):"):"   \u2713 all resolved"));
    c.failedItems.forEach(function(f){ console.log("   \u2717 "+f); });
  });
  console.log("\nTip: the \u2717 items are the files to re-upload (check for em-dashes / double spaces in their names).");
  return r;
};

window.addEventListener('load',function(){setTimeout(function(){document.getElementById('rrPlayer').classList.add('rrShow');},1400);if(RR_LIBRARY.length)rrHour=new Date().getHours();rrFillGenres();rrLoadScores();rrResolveRealPaths(rrCheckPreview);rrTab('trending');try{if(!sessionStorage.getItem('rrn_visited')){sessionStorage.setItem('rrn_visited','1');rrEvent('visit','site');}}catch(e){}setInterval(rrLoadScores,90000);setInterval(function(){if(rrPlaying){try{fetch(RR_API+"/api/radio/ping",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({voter:rrVid})}).catch(function(){});}catch(e){}}},60000);});

/* Reactions & Favorites */
(function(){
  function gFav(){ try{return JSON.parse(localStorage.getItem('rrn_favorites')||'[]');}catch(e){return[];} }
  window.rrToast=function(msg){
    var t=document.getElementById('rrToast');
    if(!t){t=document.createElement('div');t.id='rrToast';t.style.cssText='position:fixed;left:50%;bottom:98px;transform:translateX(-50%);z-index:660;background:rgba(11,24,41,.98);color:#e9eef5;border:1px solid rgba(200,145,58,.45);padding:11px 18px;border-radius:999px;font-size:13.5px;box-shadow:0 14px 44px rgba(0,0,0,.5);opacity:0;transition:opacity .25s,transform .25s;pointer-events:none;max-width:88vw;text-align:center;';document.body.appendChild(t);}
    t.textContent=msg;t.style.opacity='1';t.style.transform='translateX(-50%) translateY(-6px)';
    clearTimeout(window._rrTT);window._rrTT=setTimeout(function(){t.style.opacity='0';t.style.transform='translateX(-50%)';},1900);
  };
  window.rrReactToggle=function(e){ if(e){e.stopPropagation();} var m=document.getElementById('rrReactMenu'); if(m) m.classList.toggle('open'); };
  function closeReact(){ var m=document.getElementById('rrReactMenu'); if(m) m.classList.remove('open'); }
  document.addEventListener('click',function(e){ if(!e.target.closest('#rrReactMenu')&&!e.target.closest('#rrHeart')) closeReact(); });
  window.rrFav=function(silent){ var c=window.rrCur; if(!c){closeReact();return;}
    try{var f=gFav(); if(f.indexOf(c.src)<0){f.push(c.src);localStorage.setItem('rrn_favorites',JSON.stringify(f));}}catch(e){}
    if(window.rrEvent)rrEvent('favorite');
    var hb=document.getElementById('rrHeart'); if(hb)hb.classList.add('liked');
    if(!silent){ if(window.rrFloat)rrFloat('\u2B50','up'); rrToast('Saved to favorites'); } closeReact();
  };
  window.rrLikeSong=function(){ var c=window.rrCur; if(!c){closeReact();return;}
    if(window.rrRate)rrRate(1); window.rrFav(true); if(window.rrFloat)rrFloat('\u2764\ufe0f','up'); rrToast('Liked \u2014 you\u2019ll hear it more'); closeReact();
  };
  window.rrMoreLikeThis=function(){ var c=window.rrCur; if(!c){closeReact();return;}
    try{var k='rrn_more_like',m=JSON.parse(localStorage.getItem(k)||'{}'),g=(c.genre||'').toLowerCase();m[g]=(m[g]||0)+1;localStorage.setItem(k,JSON.stringify(m));}catch(e){}
    if(window.rrRate)rrRate(1); if(window.rrEvent)rrEvent('more_like_this'); if(window.rrFloat)rrFloat('\U0001F3B6','up');
    rrToast('More '+((c.genre||'songs like this'))+' coming up'); closeReact();
  };
  window.rrTestimony=function(){ var c=window.rrCur; if(!c){closeReact();return;} closeReact();
    var note=prompt('Share how this song helped you (a sentence or two):',''); if(note===null) return;
    var rec={song:c.title||'',src:c.src||'',text:(note||'This song helped me').trim(),at:new Date().toISOString()};
    try{var k='rrn_testimonies',a=JSON.parse(localStorage.getItem(k)||'[]');a.push(rec);localStorage.setItem(k,JSON.stringify(a));}catch(e){}
    try{ if(window.RR_API) fetch(RR_API+'/api/testimony',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(rec)}).catch(function(){}); }catch(e){}
    if(window.rrEvent)rrEvent('testimony'); if(window.rrFloat)rrFloat('\U0001F64F','up'); rrToast('Thank you for sharing your testimony');
  };
})();
