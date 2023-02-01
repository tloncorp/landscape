#!/usr/bin/env bash

# this script deploys a desk to a ship from a github repository
# assumes gcloud credentials are loaded and gcloud installed.

repo=$1
desk=$2
ship=$3
zone=$4
ref=${5:-.}
folder=$ship/$desk

set -e
set -o pipefail
cmdfile=$(mktemp "${TMPDIR:-/tmp/}janeway.XXXXXXXXX")
# mktemp only used for generating a random folder name below
cmds='
source_repo=$(mktemp --dry-run /tmp/repo.janeway.XXXXXXXXX)
echo $source_repo;
git clone git@github.com:'$repo'.git $source_repo
urbit_repo=$(mktemp --dry-run /tmp/repo.urbit.XXXXXXXXX)
echo $urbit_repo;
git clone git@github.com:urbit/urbit.git $urbit_repo
cd $source_repo
git checkout '$ref'
cd /home/urb || return
curl -s --data '\''{\"source\":{\"dojo\":\"+hood/mount %'$desk'\"},\"sink\":{\"app\":\"hood\"}}'\'' http://localhost:12321
rsync -avL --delete $source_repo/desk/ '$folder'
rsync -avL $urbit_repo/pkg/base-dev/ '$folder'
curl -s --data '\''{\"source\":{\"dojo\":\"+hood/commit %'$desk'\"},\"sink\":{\"app\":\"hood\"}}'\'' http://localhost:12321
rm -rf $source_repo
rm -rf $urbit_repo
'
echo "$cmds" >> "$cmdfile"
sshpriv=$(mktemp "${TMPDIR:-/tmp/}ssh.XXXXXXXXX")
sshpub="$sshpriv".pub
echo "$SSH_PUB_KEY" >> "$sshpub"
cat $sshpub
echo "$SSH_SEC_KEY" >> "$sshpriv"

gcloud compute \
  --project mainnet \
  ssh \
  --ssh-key-file "$sshpriv" \
  --ssh-flag="-T" \
  --zone "$zone" --verbosity info \
  urb@"$ship" < "$cmdfile"

echo "OTA performed for $desk on $ship"