import { environment } from ".././environments/environment";

export const TESTANNOTATION = '\n[Event \"GMA, Wijk aan Zee NED\"]\n[Site \"?\"]\n[Date \"2003.??.??\"]\n[Round \"1\"]\n[White \"V Anand\"]\n[Black \"T Radjabov\"]\n[Result \"1/2\"]\n[WhiteElo \"2750\"]\n[BlackElo \"2620\"]\n[ECO \"C12\"]\n[PlyCount \"55\"]\n[Annotator \"Hathaway\"]\n\n'
+
'1. e4 e6\
{ Im not terribly familiar with the style of Radjabov, so I dont know if this is his usual opening. }\
2. d4 d5 3. Nc3 Nf6 (3...Bb4\
{ The Winawer Variation is probably best, though not as easy to play. }) 4. Bg5\
{ threatens e4-e5xf6 }\
 (4. e5\
{ keeps pieces on the board and avoids ...dxe4 }) 4...Bb4 (4...Be7\
{ is more common and aims to trade dark-square bishops to ease Blacks cramp }) (4...dxe4\
{ aims to avoid any cramp by bringing pieces into alignment for trading, though White does get at least one very good piece (Ne4 or Bg5) and an easier time castling queen-side, to stir up king-side threats }\
    5. Nxe4 Be7  (\
{ or Rubinsteins }\
    5...Nbd7) ) 5. e5 h6 6. Bd2 (6. Bh4 g5 7. exf6 gxh4\
{ Black seems to equalize a little easier after this as he can win Pf6 in exchange for Ph4. }) 6...Bxc3 (6...Nfd7 7. Qg4\
{ and White isnt incurring any weaknesses, but is either gaining Bb4 for Nc3 or after ...Bb4-f8 Black is cramped again }\
    (7. Nb5 $5 Bxd2+ 8. Qxd2 a6 9. Na3) ) 7. bxc3 Ne4 8. Qg4\
{ White immediately takes aim at the backward Pg7 & Rh8 and usually Pf7 & Ke8. For the moment Bd2 serves to defend Pc3 and to prevent ...Qd8-g5 (offering a queen trade to end the pressure) . }\
    (\
{ While }\
    8. h4\
{ is often useful in the French Defense with this pawn structure, I dont know that its been tried in this opening on this move. }) 8...g6 9. Bd3 (9. h4\
{ could take over for Bd2 in guarding g5 and preparing a later attack by f2-f4, h4-h5 or vice versa. It also would allow Rh1 to develop to build the direct frontal threats to Pf7 & Pg6. }\
    9...c5 10. Bd3 Nxd2 11. Kxd2 Qa5 12. dxc5 Qxc5 13. Ne2 Qxf2 $4 14. Raf1 Qc5 15. Bxg6 fxg6 16. Qxg6+)  (9. Qd1\
{ Fritz7; Odd! }) 9...Nxd2 10. Kxd2 c5 11. Nf3\
{ This has been considered the main line for many years, but I wonder if White can allow ...c5-c4 and not use more pawns to fight through Blacks pawns. }\
    (11. dxc5\
{ is probably still wrong because of ...Qg5+ }) (11. h4\
{ still makes sense }) 11...Bd7 (11...c4 $6\
{ The problem with this is that however much it slows White, it also limits Blacks queen-side offensive possibilities. }) (\
{ Prematurely playing }\
    11...cxd4\
{ lets White straighten-out his pawns and Black has made no real progress. }\
    12. cxd4)  (11...Qa5 $5\
{ Fritz7: with the idea of ...cxd4 }) 12. dxc5 Qe7 13. Rab1 Bc6 14. Nd4 Nd7\
{ These last few moves have been quite unusual for a French Defense, but they make sense; Qe7 defends Pf7 while Bc6 defends Pb7 and Nd7 threatens Pc5 & Pe5. }\
15. Rhe1 (15. Nxc6 bxc6 16. Rb7 Qxc5 17. Qf4 g5 18. Qd4 Qa5 19. Rb2 c5 $11\
{ Fritz7 }) 15...Nxc5 16. Re3\
{ another way of getting the rook into position, in front of the king-side pawns, to threaten Blacks king-side pawns }\
16...h5 17. Qg3 O-O-O\
{ After this it would seem Blacks pieces can handle any threats White can generate. However, black might also have ideas of winning. How might he do that? Well, ...Be8, ...Kc8-b8-a8, ...Rd8-c8, ...Nc5-a4 and Pc3 is a target (slow I know) . Another idea is to keep Kd2 from ever escaping to safety by advancing ...h5-h4-h3 to break open the king-side and open the h-file for Blacks rooks. }\
    (17...h4 $15\
{ Fritz7 }) (17...Nxd3 $15\
{ Fritz7 }) 18. Ke1 Qc7 (18...h4 19. Qg4 Rh5) 19. h4\
{ Anand aims to keep the king-side perfectly safe to ensure a draw. }\
    (19. Qh4\
{ Fritz7 }) 19...Qa5 20. Kf1 (20. Nxc6 bxc6 21. Kf1 Kd7 20. Qf4 Ke8 $11\
{ Fritz7 }) 20...Rd7 (\
{ Premature is }\
    20...Qxa2 21. Ree1 Qa5  (21...Ba4 $11\
{ Fritz7 })  22. Ra1 Qxc3 23. Nxc6 bxc6 24. Ba6+ $18) 21. Qf4\
{ This general activity is perfect. It threatens Pf7, defends Nd4 and in some cases prepares for Qf4-b4 to attack Kc8. }\
    (21. Ree1\
{ Fritz7 }) (21. Nxc6 bxc6 22. Ree1\
{ Fritz7 }) 21...Rhd8\
{ Black is probably wondering why he organized his pieces to only defend light squares. Only Qa5 and Nc5 can get to dark squares and that makes Whites task of coordinating much easier. }\
    (21...Qxa2\
{ still premature }\
22. Nxc6 bxc6 23. Qb4 Nb7 24. Ree1)  (21...Qxc3 $4 22. Nxc6 bxc6 23. Ba6+)  (21...Rc7 $14\
{ Fritz7 }) (21...Na4 $14\
{ Fritz7 }) 22. Kg1 (22. Nxc6 bxc6 23. Qb4 Qxb4 24. cxb4 d4 25. Ree1 Na4 $11\
{ Fritz7 }) 22...Nxd3 23. Rxd3 (23. cxd3 Qxc3 24. Rg3 Rc7 $14\
{ Fritz7 }) 23...Qc5 (23...Qxa2 24. Rdd1 Qc4 $11\
{ Fritz7 }) 24. Rb4 a5 $2 (24...Rc7\
{ Mark and Fritz7 agree! }) 25. Rb1 Rc7 26. Qc1 Be8 27. Nb3 (27. Qb2\
{ If White commits too quickly to the b-file then Black might actually create some play against Ph4 and on the c-file. }\
    27...Qe7  (27...a4 $11\
{ Fritz7 })  28. Nf3 Rc4\
{ possibly preparing ...b5 }) 27...Qb6 (27...Qc4 28. Nxa5 Qxh4 $14\
{ Fritz7 }) 28. Nd4\
{ Black created the weakness (Pa5) and cant quite defend it, so Anand forces a draw. }\
1/2-1/2';

export const TestPGNData = '[Set "Testing Aria"]' +
    '[SetDate "October 8th - December 31st, 1990"]' +
    '[PlayerImages "' + environment.playersPath +'"]' +
    '[PlayerData "{"Garry Kasparov":{"born":"April 13th 1963","image":"Garry-Kasparov.png", "elo":2812}, "Anatoly Karpov":{"image":"Anatoly-Karpov.png", "elo":2617, "born":"May 23th 1951"}, \
    "Egemen Gulden":{"born":"2000", "image":"Egemen-Gulden.png", "elo":2118}, "Andrei Macovei":{"born":"2000", "image":"Andrei-Macovei.png", "elo":2453}, \
    "Robert James Fischer":{"born":"March 9th 1943", "image":"Bobby-Fischer-BW.png", "elo":2780}, "Hans Berliner":{"born":"Jan 27th 1929", "image":"Hans-Berliner.png"}, \
    "V Anand":{"born":"December 11th 1969", "image":"V-Anand.png", "elo":2753}, "T Radjabov":{"born":"March 12th 1987","image":"T-Radjabov.png","elo":2753}}"]' +
    '[GameData "[{"opening":"Spanish Game: Closed Variations. Keres Defense (C92)", "country":"us"},{"opening":"Formation: King\'s Indian Attack (A07)", "country":"tr"},{"opening":"Queen\'s Gambit Declined: Exchange Variation (D35)", "country":"us"}]"]' +
    '[Event "Kasparov - Karpov World Championship Match"]\n' +
    '[Site "New York, NY USA"]\n' +
    '[Date "1990.10.24"]\n' +
    '[EventDate "?"]\n' +
    '[Round "6"]\n' +
    '[Result "1/2-1/2"]\n' +
    '[White "Garry Kasparov"]\n' +
    '[Black "Anatoly Karpov"]\n' +
    '[ECO "C92"]\n' +
    '[WhiteElo "?"]\n' +
    '[BlackElo "?"]\n' +
    '[PlyCount "83"]\n' +
    '\n' +
    '1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 ' +
    'd6 8.c3 O-O 9.h3 Nd7 10.d4 Bf6 11.a4 Bb7 12.axb5 axb5 13.Rxa8 ' +
    'Qxa8 14.d5 Na5 15.Bc2 Nc4 16.b3 Ncb6 17.Na3 Ba6 18.Nh2 c6 ' +
    '19.dxc6 Qxc6 20.Bd2 Be7 21.Ng4 Ra8 22.Ne3 Nf6 23.Nf5 Bf8 ' +
    '24.Bg5 Nbd7 25.c4 bxc4 26.bxc4 Bxc4 27.Nxc4 Qxc4 28.Bb3 Qc3 ' +
    '29.Kh2 h6 30.Bxf6 Nxf6 31.Re3 Qc7 32.Rf3 Kh7 33.Ne3 Qe7 34.Nd5 ' +
    'Nxd5 35.Bxd5 Ra7 36.Qb3 f6 37.Qb8 g6 38.Rc3 h5 39.g4 Kh6 ' +
    '40.gxh5 Kxh5 41.Rc8 Bg7 42.Re8 1/2-1/2\n' +
    '\n' +
    '[Event "World Junior Championship"]\n' +
    '[Site "Gebze TUR"]\n' +
    '[Date "2018.09.05"]\n' +
    '[EventDate "2018.09.05"]\n' +
    '[Round "1.65"]\n' +
    '[Result "1-0"]\n' +
    '[White "Egemen Gulden"]\n' +
    '[Black "Andrei Macovei"]\n' +
    '[ECO "B25"]\n' +
    '[WhiteElo "2068"]\n' +
    '[BlackElo "2385"]\n' +
    '[PlyCount "62"]\n' +
    '\n' +
    '1. e4 g6 2. Nc3 Bg7 3. g3 c5 4. Bg2 Nc6 5. d3 d6 6. Nh3 e6 7. O-O Nge7 8. Be3\n' +
    'O-O 9. Qd2 Nd4 10. Nd1 b6 11. c3 Ndc6 12. Bh6 e5 13. Bxg7 Kxg7 14. Ne3 f6 15. f4\n' +
    'Rb8 16. Rf2 Bxh3 17. Bxh3 exf4 18. Rxf4 d5 19. Raf1 dxe4 20. Rxe4 f5 21. Rh4 Ng8\n' +
    '22. Nxf5+ gxf5 23. Bxf5 Rxf5 24. Rxf5 Rb7 25. Rg4+ Kh8 26. Qf4 Rb8 27. Rf7 Qxd3\n' +
    '28. Qg5 Qd1+ 29. Kg2 Qe2+ 30. Kh3 Qe5 31. Rxh7+ 1-0\n' +
    '\n' +
    '[Event "Western Open"]\n' +
    '[Site "Bay City, MI USA"]\n' +
    '[Date "1963.07.07"]\n' +
    '[EventDate "?"]\n' +
    '[Round "8"]\n' +
    '[Result "0-1"]\n' +
    '[White "Hans Berliner"]\n' +
    '[Black "Robert James Fischer"]\n' +
    '[ECO "D35"]\n' +
    '[WhiteElo "?"]\n' +
    '[BlackElo "?"]\n' +
    '[PlyCount "106"]\n' +
    '\n' +
    '1. d4 Nf6 2. c4 e6 3. Nc3 d5 4. cxd5 Nxd5 5. e4 Nxc3 6. bxc3\n' +
    'c5 7. Nf3 cxd4 8. cxd4 Bb4+ 9. Bd2 Bxd2+ 10. Qxd2 O-O 11. Bd3\n' +
    'b6 12. O-O Bb7 13. Rfd1 Nc6 14. Qb2 Qf6 15. Rac1 Rfd8 16. Bb5\n' +
    'Rac8 17. Ne5 Nxe5 18. dxe5 Qf4 19. Rxc8 Rxc8 20. Qd4 g5 21. f3\n' +
    'g4 22. Be2 gxf3 23. gxf3 Kh8 24. Kh1 Ba6 25. Qf2 Bxe2 26. Qxe2\n' +
    'Qxe5 27. Rg1 f5 28. Qd3 fxe4 29. fxe4 Rf8 30. Qc2 Qf6 31. Rg2\n' +
    'Qd4 32. h3 Qa1+ 33. Rg1 Qe5 34. Qe2 b5 35. Qc2 b4 36. Qd3 a5\n' +
    '37. Qc2 Qf6 38. Qc4 Qf3+ 39. Kh2 Rd8 40. Qc2 Qc3 41. Qxc3+\n' +
    'bxc3 42. Rc1 Rd3 43. Rb1 Kg7 44. Rb5 a4 45. Rc5 a3 46. Kg2 Re3\n' +
    '47. Rc4 Kf6 48. h4 Ke5 49. Kf2 Rh3 50. Kg2 Rd3 51. h5 Kf4\n' +
    '52. h6 Ke3 53. Rc7 Kd2 0-1\n' +
    '\n' +
    '[Event "FO-2009-0-00001"]\n' +
    '[Site "Lechenicher SchachServer"]\n' +
    '[Date "2009.06.13"]\n' +
    '[Round "?"]\n' +
    '[White "Walker, Jeffrey"]\n' +
    '[Black "Szabo, Eleonora"]\n' +
    '[Result "1-0"]\n' +
    '[WhiteElo "2000"]\n' +
    '[BlackElo "2200"]\n' +
    '[Variant "chess960"]\n' +
    '[SetUp "1"]\n' +
    '[FEN "qrbbknrn/pppppppp/8/8/8/8/PPPPPPPP/QRBBKNRN w GBgb - 0 1"]\n' +
    '[PlyCount "39"]\n' +
    '[EventDate "2009.06.11"]\n' +
    '\n' +
    '{STARTING POSITION: 773} 1. Ne3 e5 2. b4 Nhg6 3. Ng3 Ne6 4. c4 O-O 5. O-O b5 6.\n' +
    'cxb5 Rxb5 7. a4 Rb8 8. f3 d5 9. Nef5 c5 10. bxc5 Rxb1 11. Qxb1 Ba6 12. Ba3 Qc6\n' +
    '13. Qb2 Bc7 14. Nh5 Rb8 15. Qc3 d4 16. Qc1 Ba5 17. g3 Bb4 18. Bxb4 Rxb4 19. d3\n' +
    'Bb7 20. a5 1-0\n' +
    '\n' +
    '[Event "FO-2009-0-00001"]\n' +
    '[Site "Lechenicher SchachServer"]\n' +
    '[Date "2009.06.13"]\n' +
    '[Round "?"]\n' +
    '[White "Szabo, Eleonora"]\n' +
    '[Black "Walker, Jeffrey"]\n' +
    '[Result "0-1"]\n' +
    '[WhiteElo "2200"]\n' +
    '[BlackElo "2000"]\n' +
    '[Variant "chess960"]\n' +
    '[SetUp "1"]\n' +
    '[FEN "qrbbknrn/pppppppp/8/8/8/8/PPPPPPPP/QRBBKNRN w GBgb - 0 1"]\n' +
    '[PlyCount "32"]\n' +
    '[EventDate "2009.06.11"]\n' +
    '\n' +
    '{STARTING POSITION: 773} 1. Nhg3 Ne6 2. e4 Ng6 3. Ne3 b5 4. d3 O-O 5. b3 f6 6.\n' +
    'O-O c5 7. Bh5 Nef4 8. Bxg6 hxg6 9. a4 b4 10. Nc4 Ne6 11. Ne3 Bc7 12. Bb2 Nf4\n' +
    '13. Rbe1 Qc6 14. Ne2 Nxe2+ 15. Rxe2 g5 16. Nd5 Bd6 0-1\n' +
    '\n' +
    '[Event "FO-2009-0-00010"]\n' +
    '[Site "Lechenicher SchachServer"]\n' +
    '[Date "2009.06.18"]\n' +
    '[Round "?"]\n' +
    '[White "Tanti, Joseph"]\n' +
    '[Black "Dibley, Shane"]\n' +
    '[Result "0-1"]\n' +
    '[WhiteElo "2000"]\n' +
    '[BlackElo "2200"]\n' +
    '[Variant "chess960"]\n' +
    '[SetUp "1"]\n' +
    '[FEN "nbqnrkbr/pppppppp/8/8/8/8/PPPPPPPP/NBQNRKBR w HEhe - 0 1"]\n' +
    '[PlyCount "86"]\n' +
    '[EventDate "2009.06.13"]\n' +
    '\n' +
    '{STARTING POSITION:} 1. d4 c5 2. d5 c4 3. e4 e6 4. Qd2 exd5 5. Qxd5 Nb6 6. Qd2\n' +
    'h5 7. f3 h4 8. Qb4+ d6 9. Bxb6 axb6 10. Ne3 Nc6 11. Qxc4 f5 12. Nd5 Rh5 13. O-O\n' +
    'f4 14. Qd3 h3 15. Nxf4 hxg2 16. Nxh5 Ne5 17. Qd4 gxf1=Q+ 18. Rxf1 Qh3 19. Ng3\n' +
    'Bc4 20. Rf2 d5 21. c3 Nc6 22. Qe3 Bxg3 23. hxg3 O-O-O 24. f4 dxe4 25. Bc2 Bd3\n' +
    '26. Rg2 Ne5 27. fxe5 Rh8 28. Bxd3 Qh1+ 29. Kf2 Rf8+ 30. Qf4 Rxf4+ 31. gxf4 Qh4+\n' +
    '32. Kg1 exd3 33. Nb3 Qxf4 34. Nd2 Qxe5 35. Nf1 g5 36. Rd2 Qd5 37. a3 g4 38. Ne3\n' +
    'Qf3 39. Nf1 g3 40. Rg2 b5 41. Nd2 Qe3+ 42. Kf1 Kc7 43. b3 Qe5 0-1\n'
'\n';