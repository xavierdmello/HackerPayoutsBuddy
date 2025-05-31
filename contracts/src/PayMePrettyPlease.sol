// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

contract PayMePrettyPlease {
    struct Organization {
        string name;
        uint256 totalPayoutTime; // Sum of all payout times from hackathon end
        uint256 totalReviews;
        uint256 totalRating;
        uint256 lastReviewTimestamp;
        uint256 pendingPayouts;
        uint256 paidOutReviews;
    }

    struct Review {
        string sponsor;
        uint8 rating;
        string comment;
        string[] evidenceHashes;
        uint256 prizeAmount;
        bool prizePaidOut;
        uint256 hackathonEndDate;
        uint256 payoutDate;
        address reviewer;
    }

    // State variables
    mapping(uint256 => Review) public reviews;
    mapping(string => Organization) public organizations;
    string[] public organizationNames; // Array to track organization names
    uint256 public reviewCount;

    // Events
    event ReviewSubmitted(uint256 indexed reviewId, address indexed reviewer, string sponsor);
    event PrizePaidOut(uint256 indexed reviewId, string sponsor, uint256 payoutTime);

    function submitReview(
        string memory _sponsor,
        uint8 _rating,
        string memory _comment,
        string[] memory _evidenceHashes,
        uint256 _prizeAmount,
        uint256 _hackathonEndDate,
        bool _isAlreadyPaidOut,
        uint256 _payoutDate
    ) public {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
      
        uint256 reviewId = reviewCount++;
        
        // Update organization stats
        Organization storage org = organizations[_sponsor];
        if (org.totalReviews == 0) {
            // New organization, add to names array
            organizationNames.push(_sponsor);
        }
        org.name = _sponsor;
        org.totalReviews++;
        org.totalRating += _rating;
        org.lastReviewTimestamp = block.timestamp;

        if (_isAlreadyPaidOut) {
            org.paidOutReviews++;
            org.totalPayoutTime += (_payoutDate - _hackathonEndDate);
        } else {
            org.pendingPayouts++;
        }
        
        reviews[reviewId] = Review({
            sponsor: _sponsor,
            rating: _rating,
            comment: _comment,
            evidenceHashes: _evidenceHashes,
            prizeAmount: _prizeAmount,
            prizePaidOut: _isAlreadyPaidOut,
            hackathonEndDate: _hackathonEndDate,
            payoutDate: _isAlreadyPaidOut ? _payoutDate : 0,
            reviewer: msg.sender
        });

        emit ReviewSubmitted(reviewId, msg.sender, _sponsor);
    }

    function markPrizePaidOut(uint256 _reviewId) public {
        require(_reviewId < reviewCount, "Review does not exist");
        Review storage review = reviews[_reviewId];
        require(!review.prizePaidOut, "Prize already paid out");
        
        uint256 currentTimestamp = block.timestamp;
        uint256 payoutTime = currentTimestamp - review.hackathonEndDate;
        
        // Update organization stats
        Organization storage org = organizations[review.sponsor];
        org.totalPayoutTime += payoutTime;
        org.pendingPayouts--;
        org.paidOutReviews++;
        
        // Update review
        review.prizePaidOut = true;
        review.payoutDate = currentTimestamp;

        emit PrizePaidOut(_reviewId, review.sponsor, payoutTime);
    }

    // View functions
    function getReview(uint256 _reviewId) public view returns (Review memory) {
        require(_reviewId < reviewCount, "Review does not exist");
        return reviews[_reviewId];
    }

    function getOrganization(string memory _sponsor) public view returns (
        string memory name,
        uint256 avgPayoutTime,
        uint256 rating,
        uint256 totalReviews,
        uint256 lastReviewTimestamp,
        uint256 pendingPayouts,
        uint256 paidOutReviews
    ) {
        Organization storage org = organizations[_sponsor];
        return (
            org.name,
            org.paidOutReviews > 0 ? org.totalPayoutTime / org.paidOutReviews : 0,
            org.totalReviews > 0 ? org.totalRating / org.totalReviews : 0,
            org.totalReviews,
            org.lastReviewTimestamp,
            org.pendingPayouts,
            org.paidOutReviews
        );
    }

    //maybe unused
    function getReviewsBySponsor(string memory _sponsor) public view returns (uint256[] memory) {
        uint256[] memory sponsorReviews = new uint256[](reviewCount);
        uint256 count = 0;
        
        for (uint256 i = 0; i < reviewCount; i++) {
            if (keccak256(bytes(reviews[i].sponsor)) == keccak256(bytes(_sponsor))) {
                sponsorReviews[count] = i;
                count++;
            }
        }
        
        assembly {
            mstore(sponsorReviews, count)
        }
        
        return sponsorReviews;
    }

    function getAllReviewsFromSponsor(string memory _sponsor) public view returns (Review[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < reviewCount; i++) {
            if (keccak256(bytes(reviews[i].sponsor)) == keccak256(bytes(_sponsor))) {
                count++;
            }
        }

        Review[] memory sponsorReviews = new Review[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < reviewCount; i++) {
            if (keccak256(bytes(reviews[i].sponsor)) == keccak256(bytes(_sponsor))) {
                sponsorReviews[index] = reviews[i];
                index++;
            }
        }
        
        return sponsorReviews;
    }

    // New function to get all organizations
    function getAllOrganizations() public view returns (Organization[] memory) {
        Organization[] memory orgs = new Organization[](organizationNames.length);
        for (uint256 i = 0; i < organizationNames.length; i++) {
            orgs[i] = organizations[organizationNames[i]];
        }
        return orgs;
    }

    // New function to get organization names
    function getOrganizationNames() public view returns (string[] memory) {
        return organizationNames;
    }
}
