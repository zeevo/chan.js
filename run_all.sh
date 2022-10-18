for dir in $(find output/ -type d | tail -n +2)
do
  echo $dir
  bash images.sh "$dir"
done
