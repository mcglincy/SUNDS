#!/usr/bin/ruby
#
# Downsample the specified set of images.
#
# USAGE: down_sample.rb [input pattern] [output dir] [every N] 

input_dir = ARGV[0]
output_dir = ARGV[1]
every_n = Integer(ARGV[2])

# get the list of all files
files = Dir.glob(File.join(input_dir, "*.jpg"))
files.sort!

# keep every Nth file
kept_files = []
(0..files.length-1).step(every_n) do |i|
  kept_files << files[i]
end

# now, copy our kept files to the right numbered suffix
# we expect the original files to be in [prefix]_[number].jpg format
kept_num = 1
kept_files.each do |old_file|
  new_file = File.basename(old_file).sub(/\d+.jpg/, "#{kept_num}.jpg")
  new_file_path = File.join(output_dir, new_file)
  Kernel.system("cp #{old_file} #{new_file_path}")
  kept_num += 1
end
