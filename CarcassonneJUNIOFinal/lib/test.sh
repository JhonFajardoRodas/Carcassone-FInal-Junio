#!/bin/bash

fileName="/tmp/test-$(date +%Hh%Mm%Ss)-$RANDOM.js"
echo "New file created for testing:" $fileName

touch $fileName

file[0]=TreeStructure_v2.js
file[1]=Tiles.js
file[2]=Dummy.js
file[3]=Players.js
file[4]=Games.js
file[5]=Game.js
file[6]=TreesCollection.js
file[7]=Board.js
file[8]=PlayersIA.js
file[9]=Msgs.js
file[10]=pruebas.js

for f in ${file[*]};
do
    if [ -r $f ]; then
	echo "adding" $f
	cat $f >> $fileName
	echo -e "\n\n\n\n\n" >> $fileName
	echo "//==================================================================" >> $fileName
	echo -e "\n\n\n\n\n" >> $fileName
    fi
done

echo "_____BEGIN______"
nodejs "$fileName"
if [ $? != 0 ]; then
	subl -a $fileName
fi
echo "______END_______"

#rm $fileName
