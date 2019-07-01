import Block from 'medulas-react-components/lib/components/Block';
import Hairline from 'medulas-react-components/lib/components/Hairline';
import React from 'react';
import Proposal, { Props } from './Proposal';

// Utility methods to generate random data to do layout before consuming API

const shortDesc = 'Lorem ipsum';

const largeDesc = `
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

const randomDesc = (): string => {
  const random = Math.random();
  if (random < 0.5) return shortDesc;
  return largeDesc;
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

const getProps = (): Props => {
  const creationDate = randomDate();
  const expiryDate = randomDate();
  const quorum = randomQuorum();
  const vote = randomVote();

  return {
    id: randomString().substring(0, 3),
    title: randomString(),
    author: randomString().substring(0, 5),
    description: randomDesc(),
    creationDate: creationDate,
    expiryDate: expiryDate,
    quorum: quorum,
    threshold: quorum / 2 + 1,
    vote: vote,
    status: getStatus(vote, creationDate, expiryDate),
  };
};

const props = new Array(10).fill({}).map(() => {
  return getProps();
});

const ProposalsList = (): JSX.Element => {
  const proposals = props.map((_, index) => {
    if (index === 0) return Proposal(props[index]);
    return (
      <React.Fragment>
        <Hairline />
        {Proposal(props[index])}
      </React.Fragment>
    );
  });

  return <Block flexGrow={1}>{proposals}</Block>;
};

export default ProposalsList;
