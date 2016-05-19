#!/bin/bash

##memo:merger of commits
##1.: git rebase -i master~N
##2.: git push -f origin master

function goto
{
    label=$1
    cmd=$(sed -n "/$label:/{:a;n;p;ba};" $0 | grep -v ':$')
    eval "$cmd"
    exit
}

start=${1:-"start"}
goto $start

start:
	ant -lib yuicompressor-2.4.8.jar -f compile/build.xml
goto end

test:
	node examples/dev-test.js
goto end

clear:
	rm -rf *~
goto end

update:
	./com clear
	git config --global user.email "siendsi@gmail.com"
	git config --global user.name  "S.S.Korotaev"
	git add -A
	git add .
	echo "input the text that best describes the changes:"
	read message
	DATE=`date +%Y-%m-%d_%H:%M:%S`
	if [[ $message = "" ]]
	then 
	git commit -a -m "$DATE"
	else 
	git commit -a -m "$message"
	fi
	git push origin master
goto end

end:
