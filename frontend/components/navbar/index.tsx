import React from "react";
import { NextComponentType } from "next";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import {
  Box,
  Stack,
  Link as _Link,
  Button,
  IconButton,
  useColorMode,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const Navbar: NextComponentType = () => {
  const [session] = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = { light: "white", dark: "gray.800" };
  const color = { light: "gray.800", dark: "gray.100" };

  const handleToggleTheme = () => {
    console.log("hello");

    toggleColorMode();
  };

  const linksForAllUsers = [
    {
      id: "home",
      label: "Home",
      href: "/",
    },
  ];

  const linksForAuthenticatedUsers = [
    {
      id: "feeds",
      label: "Feeds",
      href: "/feeds",
    },
    {
      id: "myAccount",
      label: "My Account",
      href: "/my-account",
    },
  ];

  const signInButtonNode = () => {
    if (session) {
      return false;
    }

    return (
      <Box>
        <Link href="/api/auth/signin">
          <Button
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            Sign In
          </Button>
        </Link>
      </Box>
    );
  };

  const signOutButtonNode = () => {
    if (!session) {
      return false;
    }

    return (
      <Box>
        <Link href="/api/auth/signout">
          <Button
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign Out
          </Button>
        </Link>
      </Box>
    );
  };

  const themeToggleButtonNode = () => {
    return (
      <IconButton
        aria-label="Toggle theme"
        // fontSize="20px"
        borderRadius="md"
        icon={useColorModeValue(<SunIcon/>, <MoonIcon/>)}
        onClick={() => handleToggleTheme()}
      />
    );
  };

  return (
    <Box bg={bgColor[colorMode]}>
      <Box p={4} color={color[colorMode]} shadow="lg" pos="relative">
        <Box mx="auto" w="full">
          <Stack
            isInline
            spacing={4}
            align="center"
            justifyContent="space-between"
            w="full"
          >
            <Box>
              <HStack isInline spacing={4} align="center" fontWeight="semibold">
                {linksForAllUsers.map((link) => {
                  return (
                    <Box key={link.id}>
                      <Link href={link.href}>
                        <_Link>{link.label}</_Link>
                      </Link>
                    </Box>
                  );
                })}
                {session &&
                  linksForAuthenticatedUsers.map((link) => {
                    return (
                      <Box key={link.id}>
                        <Link href={link.href}>
                          <_Link>{link.label}</_Link>
                        </Link>
                      </Box>
                    );
                  })}
              </HStack>
            </Box>
            <Box>
              <HStack spacing={4} align="center">
                {themeToggleButtonNode()}
                {signInButtonNode()}
                {signOutButtonNode()}
              </HStack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
