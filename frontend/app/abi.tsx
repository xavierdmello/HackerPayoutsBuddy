export const abi = [
  {
    type: "function",
    name: "getAllOrganizations",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct PayMePrettyPlease.Organization[]",
        components: [
          { name: "name", type: "string", internalType: "string" },
          { name: "totalPayoutTime", type: "uint256", internalType: "uint256" },
          { name: "totalReviews", type: "uint256", internalType: "uint256" },
          { name: "totalRating", type: "uint256", internalType: "uint256" },
          {
            name: "lastReviewTimestamp",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "pendingPayouts", type: "uint256", internalType: "uint256" },
          { name: "paidOutReviews", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAllReviewsFromSponsor",
    inputs: [{ name: "_organization", type: "string", internalType: "string" }],
    outputs: [
      {
        name: "",
        type: "tuple[]",
        internalType: "struct PayMePrettyPlease.Review[]",
        components: [
          { name: "organization", type: "string", internalType: "string" },
          { name: "eventName", type: "string", internalType: "string" },
          { name: "title", type: "string", internalType: "string" },
          { name: "comment", type: "string", internalType: "string" },
          { name: "rating", type: "uint8", internalType: "uint8" },
          {
            name: "evidenceHashes",
            type: "string[]",
            internalType: "string[]",
          },
          { name: "prizeAmount", type: "uint256", internalType: "uint256" },
          { name: "prizePaidOut", type: "bool", internalType: "bool" },
          {
            name: "hackathonEndDate",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "payoutDate", type: "uint256", internalType: "uint256" },
          { name: "reviewer", type: "address", internalType: "address" },
          { name: "reviewId", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrganization",
    inputs: [{ name: "_organization", type: "string", internalType: "string" }],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "avgPayoutTime", type: "uint256", internalType: "uint256" },
      { name: "rating", type: "uint256", internalType: "uint256" },
      { name: "totalReviews", type: "uint256", internalType: "uint256" },
      { name: "lastReviewTimestamp", type: "uint256", internalType: "uint256" },
      { name: "pendingPayouts", type: "uint256", internalType: "uint256" },
      { name: "paidOutReviews", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getOrganizationNames",
    inputs: [],
    outputs: [{ name: "", type: "string[]", internalType: "string[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReview",
    inputs: [{ name: "_reviewId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct PayMePrettyPlease.Review",
        components: [
          { name: "organization", type: "string", internalType: "string" },
          { name: "eventName", type: "string", internalType: "string" },
          { name: "title", type: "string", internalType: "string" },
          { name: "comment", type: "string", internalType: "string" },
          { name: "rating", type: "uint8", internalType: "uint8" },
          {
            name: "evidenceHashes",
            type: "string[]",
            internalType: "string[]",
          },
          { name: "prizeAmount", type: "uint256", internalType: "uint256" },
          { name: "prizePaidOut", type: "bool", internalType: "bool" },
          {
            name: "hackathonEndDate",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "payoutDate", type: "uint256", internalType: "uint256" },
          { name: "reviewer", type: "address", internalType: "address" },
          { name: "reviewId", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "markPrizePaidOut",
    inputs: [{ name: "_reviewId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "organizationNames",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "string", internalType: "string" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "organizations",
    inputs: [{ name: "", type: "string", internalType: "string" }],
    outputs: [
      { name: "name", type: "string", internalType: "string" },
      { name: "totalPayoutTime", type: "uint256", internalType: "uint256" },
      { name: "totalReviews", type: "uint256", internalType: "uint256" },
      { name: "totalRating", type: "uint256", internalType: "uint256" },
      { name: "lastReviewTimestamp", type: "uint256", internalType: "uint256" },
      { name: "pendingPayouts", type: "uint256", internalType: "uint256" },
      { name: "paidOutReviews", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reviewCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "reviews",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "organization", type: "string", internalType: "string" },
      { name: "eventName", type: "string", internalType: "string" },
      { name: "title", type: "string", internalType: "string" },
      { name: "comment", type: "string", internalType: "string" },
      { name: "rating", type: "uint8", internalType: "uint8" },
      { name: "prizeAmount", type: "uint256", internalType: "uint256" },
      { name: "prizePaidOut", type: "bool", internalType: "bool" },
      { name: "hackathonEndDate", type: "uint256", internalType: "uint256" },
      { name: "payoutDate", type: "uint256", internalType: "uint256" },
      { name: "reviewer", type: "address", internalType: "address" },
      { name: "reviewId", type: "uint256", internalType: "uint256" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "submitReview",
    inputs: [
      { name: "_organization", type: "string", internalType: "string" },
      { name: "_eventName", type: "string", internalType: "string" },
      { name: "_title", type: "string", internalType: "string" },
      { name: "_comment", type: "string", internalType: "string" },
      { name: "_rating", type: "uint8", internalType: "uint8" },
      { name: "_evidenceHashes", type: "string[]", internalType: "string[]" },
      { name: "_prizeAmount", type: "uint256", internalType: "uint256" },
      { name: "_hackathonEndDate", type: "uint256", internalType: "uint256" },
      { name: "_isAlreadyPaidOut", type: "bool", internalType: "bool" },
      { name: "_payoutDate", type: "uint256", internalType: "uint256" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "DebugOrganizationSearch",
    inputs: [
      {
        name: "organization",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "count",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "PrizePaidOut",
    inputs: [
      {
        name: "reviewId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "organization",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "payoutTime",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ReviewSubmitted",
    inputs: [
      {
        name: "reviewId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "reviewer",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "organization",
        type: "string",
        indexed: false,
        internalType: "string",
      },
      {
        name: "eventName",
        type: "string",
        indexed: false,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
] as const;
