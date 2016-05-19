
all:
	ant -lib yuicompressor-2.4.8.jar -f compile/build.xml
clear:
	rm -rf *~
index:
	make clear
	git config --global user.email "siendsi@gmail.com"
	git config --global user.name  "S.S.Korotaev"
	git add -A
	git add *.sjs
	git add *.js 
	git add *.html
	git add *.jar
	git add *.xml
	git add *.sh
	git commit -a -m `date +%Y-%m-%d_%H:%M:%S` 
	git push origin master

	
