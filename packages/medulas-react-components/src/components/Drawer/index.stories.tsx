import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import React from "react";

import { medulasRoot, Storybook } from "../../utils/storybook";
import Block from "../Block";
import Link from "../Link";
import PageLayout from "../PageLayout";
import Typography from "../Typography";
import secCenter from "./assets/secCenter.svg";
import Drawer from "./index";

storiesOf(`${medulasRoot}/components`, module).add("Drawer", () => {
  const items = [
    {
      icon: secCenter,
      text: "Security Center",
      action: action("travelled to Security center"),
    },
    { text: "Invite Friends", action: action("travelled to Invite Friends") },
  ];

  const footer = (
    <Block textAlign="center">
      Meet our team at <Link to="https://iov.one/">iov.one</Link>
    </Block>
  );

  return (
    <Storybook>
      <Drawer items={items} footer={footer}>
        <PageLayout primaryTitle="Example of" title="drawer">
          <Typography paragraph>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum facilisis leo vel.
            Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum quisque non
            tellus. Convallis convallis tellus id interdum velit laoreet id donec ultrices. Odio morbi quis
            commodo odio aenean sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies integer
            quis. Cursus euismod quis viverra nibh cras. Metus vulputate eu scelerisque felis imperdiet proin
            fermentum leo. Mauris commodo quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
            vivamus at augue. At augue eget arcu dictum varius duis at consectetur lorem. Velit sed
            ullamcorper morbi tincidunt. Lorem donec massa sapien faucibus et molestie ac.
          </Typography>
          <Typography paragraph>
            Consequat mauris nunc congue nisi vitae suscipit. Fringilla est ullamcorper eget nulla facilisi
            etiam dignissim diam. Pulvinar elementum integer enim neque volutpat ac tincidunt. Ornare
            suspendisse sed nisi lacus sed viverra tellus. Purus sit amet volutpat consequat mauris. Elementum
            eu facilisis sed odio morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
            ornare massa eget egestas purus viverra accumsan in. In hendrerit gravida rutrum quisque non
            tellus orci ac. Pellentesque nec nam aliquam sem et tortor. Habitant morbi tristique senectus et.
            Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
            eleifend. Commodo viverra maecenas accumsan lacus vel facilisis. Nulla posuere sollicitudin
            aliquam ultrices sagittis orci a.
          </Typography>
        </PageLayout>
      </Drawer>
    </Storybook>
  );
});
