for file in "$1"/*.{jpg,png}
do
  filename=`convert "$file" -scale 1x1\! txt:- | tail -n 1 | awk -F\( '{print $2}'|cut -d\) -f1|awk -F\, '{print $1$2$3}'`

  extension=${file#*.}
  while [ -f "$filename.$extension" ]
  do
    random=`echo $RANDOM % 10 + 1 | bc`
    filename=$filename$random
  done

  mv "$file" "$1"/$filename.$extension
done