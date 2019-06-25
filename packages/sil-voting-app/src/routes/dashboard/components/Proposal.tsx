import { makeStyles } from '@material-ui/styles';
import Block from 'medulas-react-components/lib/components/Block';
import Button from 'medulas-react-components/lib/components/Button';
import Typography from 'medulas-react-components/lib/components/Typography';
import React from 'react';

// Utility methods to generate random data to do layout before consuming API

const loremDesc = `
Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.

Expetenda tincidunt in sed, ex partem placerat sea, porro commodo ex eam. His putant aeterno interesset at. Usu ea mundi tincidunt, omnium virtute aliquando ius ex. Ea aperiri sententiae duo. Usu nullam dolorum quaestio ei, sit vidit facilisis ea. Per ne impedit iracundia neglegentur. Consetetur neglegentur eum ut, vis animal legimus inimicus id.

His audiam deserunt in, eum ubique voluptatibus te. In reque dicta usu. Ne rebum dissentiet eam, vim omnis deseruisse id. Ullum deleniti vituperata at quo, insolens complectitur te eos, ea pri dico munere propriae. Vel ferri facilis ut, qui paulo ridens praesent ad. Possim alterum qui cu. Accusamus consulatu ius te, cu decore soleat appareat usu.
`;

const randomString = (): string => {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
};

const randomDate = (): Date => {
  return new Date(Math.random() * new Date().getTime());
};

const randomQuorum = (): number => {
  return Math.random() * (30 - 10) + 10;
};

const randomVote = (): 'Invalid' | 'Yes' | 'No' | 'Abstain' => {
  const random = Math.random();
  if (random < 0.25) return 'Invalid';
  if (random < 0.5) return 'Yes';
  if (random < 0.75) return 'No';
  return 'Abstain';
};

const getStatus = (
  vote: 'Invalid' | 'Yes' | 'No' | 'Abstain',
  creationDate: Date,
  expiryDate: Date,
): 'Active' | 'Submitted' | 'Ended' => {
  if (creationDate > expiryDate) return 'Ended';
  if (vote !== 'Invalid') return 'Submitted';
  return 'Active';
};

interface Props {
  readonly id: string;
  readonly title: string;
  readonly author: string;
  readonly description: string;
  readonly creationDate: Date;
  readonly expiryDate: Date;
  readonly quorum: number;
  readonly threshold: number;
  readonly vote: 'Invalid' | 'Yes' | 'No' | 'Abstain';
  readonly status: 'Active' | 'Submitted' | 'Ended';
}

const useStyles = makeStyles(() => ({
  voteBlock: {
    flexBasis: '205px',
  },
  drawerPaper: {
    position: 'relative',
    border: 'none',
  },
  list: {
    border: 'none',
  },
}));

const Proposal = (props?: Props): JSX.Element => {
  const quorum = randomQuorum();
  const creationDate = randomDate();
  const expiryDate = randomDate();
  const vote = randomVote();
  props = {
    id: 'ID ' + randomString(),
    title: 'T ' + randomString(),
    author: 'A ' + randomString(),
    description: loremDesc,
    creationDate: creationDate,
    expiryDate: expiryDate,
    quorum: quorum,
    threshold: quorum / 2 + 1,
    vote: vote,
    status: getStatus(vote, creationDate, expiryDate),
  };

  const classes = useStyles();
  /* const paperClasses = {
    paper: classes.drawerPaper,
  };
  const listClasses = {
    root: classes.list,
  }; */

  return (
    <Block width="100%" display="flex" alignItems="center" border="1px solid black">
      {/*<Typography variant="h6">{props.title}</Typography>
      <Typography variant="h6">{props.author}</Typography>
      <Typography variant="h6">{props.description}</Typography>
      <Typography variant="h6">{props.creationDate.toString()}</Typography>
      <Typography variant="h6">{props.expiryDate.toString()}</Typography>
      <Typography variant="h6">{props.quorum}</Typography>
      <Typography variant="h6">{props.threshold}</Typography>
      <Typography variant="h6">{props.vote}</Typography>
      <Typography variant="h6">{props.status}</Typography> */}
      <Block flexGrow={1}>
        <Typography variant="h6">{props.title}</Typography>
        <Typography variant="body1">Proposer: {props.author}</Typography>
        <Typography variant="body1">{props.description}</Typography>
      </Block>
      <Block className={classes.voteBlock} display="flex" flexDirection="column">
        <Typography variant="body1">Your Vote:</Typography>
        <Button>Yes</Button>
        <Button>No</Button>
        <Button>Abstain</Button>
      </Block>
    </Block>
  );
};

export default Proposal;
