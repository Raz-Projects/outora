-- ═══════════════════════════════════════════════════════════════
-- קישור לדף המקום · ליד הקישור להזמנה (parks_url)
-- מקור: "OUTORA - לוקיישנים וקישורים ישירים" (29.09.2026)
-- ═══════════════════════════════════════════════════════════════

ALTER TABLE locations ADD COLUMN IF NOT EXISTS info_url TEXT;

UPDATE locations SET name_he = 'נחל שקמה (אשקלון)',
  description_he = replace(description_he, 'גן לאומי ירוק בין תל אביב לאשקלון', 'דרך נוף ירוקה של קק״ל לאורך נחל שקמה, ליד אשקלון')
  WHERE id = 'nahal-shikmim';

UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-גן-לאומי-אכזיב-וחוף-אכזיב/', info_url = 'https://www.parks.org.il/reserve-park/גן-לאומי-אכזיב-וחוף-אכזיב/' WHERE id = 'achziv-beach';
UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-גן-לאומי-חורשת-טל/', info_url = 'https://www.parks.org.il/reserve-park/גן-לאומי-חורשת-טל/' WHERE id = 'horshat-tal';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_ein_zivan/', info_url = 'https://www.kkl.org.il/travel/campground_ein_zivan/' WHERE id = 'golan-hermon';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/שמורת-טבע-גמלא/' WHERE id = 'golan-gamla';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_park_goren/', info_url = 'https://www.kkl.org.il/travel/campground_park_goren/' WHERE id = 'montfort';
UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-שמורת-טבע-נחל-עמוד/', info_url = 'https://www.parks.org.il/camping/חניון-לילה-שמורת-טבע-נחל-עמוד/' WHERE id = 'nahal-amud';
UPDATE locations SET parks_url = NULL, info_url = 'https://tiulim.education.gov.il/trips-katalog/nahal-shagur/' WHERE id = 'nahal-shagur';
UPDATE locations SET parks_url = NULL, info_url = 'https://ikinneret.org.il/מידע-ושירותים/מדריך-חופי-כינרת/' WHERE id = 'kinneret-north';
UPDATE locations SET parks_url = NULL, info_url = 'https://ikinneret.org.il/beaches/חוף-חוקוק-צפון/' WHERE id = 'hukuk-north';
UPDATE locations SET parks_url = NULL, info_url = 'https://ikinneret.org.il/beaches/חוף-דוגה/' WHERE id = 'duga-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://ikinneret.org.il/beaches/חוף-סוסיתא/' WHERE id = 'susita-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://ikinneret.org.il/beaches/חוף-גופרה/' WHERE id = 'gofra-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://shimur.org/sites/תצפית-מיכל-פארק-נהריים-אשדות-יעקב/' WHERE id = 'nahariyim';
UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-חוות-משמר-הכרמל/', info_url = 'https://www.parks.org.il/camping/חניון-לילה-חוות-משמר-הכרמל/' WHERE id = 'carmel-beit-oren';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/שמורת-טבע-נחל-תנינים/' WHERE id = 'nahal-taninim';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/שמורת-טבע-חוף-דור-הבונים/' WHERE id = 'dor-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/גן-לאומי-ושמורת-טבע-חוף-גדור/' WHERE id = 'gador-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/גן-לאומי-חוף-פלמחים/' WHERE id = 'palmachim-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/trip/sorek/' WHERE id = 'nahal-sorek';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.kkl.org.il/travel/trips/2963/' WHERE id = 'nahal-shikmim';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_ben_shemen/', info_url = 'https://www.kkl.org.il/travel/campground_ben_shemen/' WHERE id = 'ben-shemen';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.kkl.org.il/travel/parking_lot_britanya/' WHERE id = 'sharigim';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_uk/', info_url = 'https://www.kkl.org.il/travel/campground_uk/' WHERE id = 'masua';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_bney_tzion/', info_url = 'https://www.kkl.org.il/travel/campground_bney_tzion/' WHERE id = 'jerusalem-forest';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/גן-לאומי-עין-חמד/' WHERE id = 'ein-hemed';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.kkl.org.il/travel/parking_lot_hahamisha/' WHERE id = 'maaleh-hahamisha';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_har_eitan/', info_url = 'https://www.kkl.org.il/travel/campground_har_eitan/' WHERE id = 'har-eitan';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_shoresh/', info_url = 'https://www.kkl.org.il/travel/campground_shoresh/' WHERE id = 'shoresh';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_nes_harim/', info_url = 'https://www.kkl.org.il/travel/campground_nes_harim/' WHERE id = 'nes-harim';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_aminadav/', info_url = 'https://www.kkl.org.il/travel/campground_aminadav/' WHERE id = 'aminadav';
UPDATE locations SET parks_url = 'https://www.kkl.org.il/travel/campground_bar_giora/', info_url = 'https://www.kkl.org.il/travel/campground_bar_giora/' WHERE id = 'bar-giora';
UPDATE locations SET parks_url = 'https://www.simplebooking.it/ibe2/hotel/10206?lang=HE&cur=ILS', info_url = 'https://cityofdavid.org.il/sites/peace-forest/' WHERE id = 'peace-forest';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/שמורת-טבע-נחל-פרת-עין-פרת/' WHERE id = 'nahal-prat';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/שמורת-טבע-עין-גדי/' WHERE id = 'ein-gedi';
UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-גן-לאומי-מצדה-מערב-–-מחנה-מצדה/', info_url = 'https://www.parks.org.il/camping/חניון-לילה-גן-לאומי-מצדה-מערב-–-מחנה-מצדה/' WHERE id = 'masada';
UPDATE locations SET parks_url = 'https://www.metzoke.co.il/reservation', info_url = 'https://www.metzoke.co.il/rooms/camping' WHERE id = 'dragot-cliffs';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.deadsea.co.il/attractions/חופי-חמי-זוהר/' WHERE id = 'dead-sea-north';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/free_camping/נחל-צאלים-תחתון/' WHERE id = 'arava-gorge';
UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-גן-לאומי-תל-ערד-–-החאן-הכנעני/', info_url = 'https://www.parks.org.il/camping/חניון-לילה-גן-לאומי-תל-ערד-–-החאן-הכנעני/' WHERE id = 'arad-desert';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/free_camping/המכתש-הקטן/' WHERE id = 'makhtesh-katan';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/free_camping/סרפנטינות/' WHERE id = 'sde-boker';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/free_camping/נחל-ציחור/' WHERE id = 'nahal-tzihor';
UPDATE locations SET parks_url = 'https://www.parks.org.il/camping/חניון-לילה-חאן-בארות-מכתש-רמון/', info_url = 'https://www.parks.org.il/camping/חניון-לילה-חאן-בארות-מכתש-רמון/' WHERE id = 'ramon-crater';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/free_camping/נחל-פארן/' WHERE id = 'nahal-paran';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.deadsea.co.il/accommodations/קמפינג-נאות/' WHERE id = 'neot-hakikar';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/trip/hatzeva-hill/' WHERE id = 'hatzeva';
UPDATE locations SET parks_url = NULL, info_url = 'https://goarava.co.il/מתמר-המקראית-ועד-עין-יהב/' WHERE id = 'ein-yahav';
UPDATE locations SET parks_url = 'https://parktimna.co.il/accomodation/camping/', info_url = 'https://parktimna.co.il/accomodation/camping/' WHERE id = 'timna';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.eilat.muni.il/חופים-מוכרזים-לרחצה/' WHERE id = 'eilat-north-beach';
UPDATE locations SET parks_url = NULL, info_url = 'https://www.parks.org.il/reserve-park/שמורת-טבע-חוף-האלמוגים/' WHERE id = 'eilat-coral-beach';
