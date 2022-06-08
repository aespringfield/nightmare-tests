import React, { useEffect, useMemo, useState } from 'react';
import propTypes from 'prop-types';
import { useCookies } from 'react-cookie';
import SharedLayout from 'components/layout/SharedLayout';
import PageTitleWithContainer from 'components/PageTitleWithContainer';
import Button from 'components/Button';
import Select from 'components/Select';
import Card from 'components/Card';
import Banner from 'components/Banner';
import LoadingSpinner from 'components/LoadingSpinner';
import { getJobs } from '../../datasources';
import { UnauthorizedError } from '../../errors';

import 'stylesheets/page';
import 'stylesheets/jobs';

const Jobs = () => {
    const INITIAL_SORT_ORDER = 'most-recent';
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [sortOrder, setSortOrder] = useState(INITIAL_SORT_ORDER);
    const [cookies] = useCookies();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getJobs(cookies['wnb_job_board_token'], sortOrder);
                setJobs(data);
                setLoading(false);
            } catch (error) {
                if (error instanceof UnauthorizedError) {
                    window.location.href = '/jobs/authenticate';
                } else {
                    // TODO: add error boundaries
                    console.log(error.message);
                }
            }
        };

        fetchData();
    }, [cookies, sortOrder]);

    const [firstSixJobs, restOfJobs] = useMemo(() => {
        if (jobs === []) {
            return [[], []];
        }

        const firstSix = jobs.slice(0, 6);
        const rest = jobs.slice(6, jobs.length);

        return [firstSix, rest];
    }, [jobs]);

    return (
        <SharedLayout>
            <PageTitleWithContainer text="Jobs" />
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="jobs-container">
                    <Select
                        onSelect={async (value) => {
                            setSortOrder(value);
                        }}
                        defaultValue={sortOrder}
                        options={[
                            {
                                value: 'most-recent',
                                label: 'Sort by: Most recent',
                            },
                            {
                                value: 'company',
                                label: 'Sort by: Company',
                            },
                            {
                                value: 'title',
                                label: 'Sort by: Title',
                            },
                        ]}
                    ></Select>
                    <JobGroup sortOrder={sortOrder}>
                        {firstSixJobs.map((job, i) => (
                            <Job key={job.id} htmlId={`job-card-${i}`} {...job} />
                        ))}
                    </JobGroup>
                    <SponsorUsBanner />
                    <JobGroup>
                        {restOfJobs.map((job) => (
                            <Job key={`${job.title}-${job.company}`} {...job} />
                        ))}
                    </JobGroup>
                </div>
            )}
        </SharedLayout>
    );
};

const JobGroup = ({ children }) => <div className="job-group">{children}</div>;

JobGroup.propTypes = {
    children: propTypes.node,
};

const SponsorUsBanner = () => {
    return (
        <Banner>
            Want to see your company&apos;s job on our board?
            <Button type="white" className="ml-0 md:ml-5 mt-5 md:mt-0">
                <a href={'/sponsor-us'} target="_blank" rel="noopener noreferrer">
                    Sponsor Us
                </a>
            </Button>
        </Banner>
    );
};

const Job = ({ htmlId, title, description, imageUrl, company, link, location }) => {
    return (
        <Card id={htmlId} className="job-card mx-0 my-5 md:mr-8 max-w-[22rem]">
            <div className="flex flex-row">
                <img className="w-14 h-14 shadow-sm rounded-full mr-6" src={imageUrl} alt="" />
                <div className="flex flex-col">
                    <h2 className="font-bold text-lg text-[#4a4a4a]">{title}</h2>
                    <div className="company mt-1">{company}</div>
                    <div className="font-light">{location}</div>
                </div>
            </div>
            <div className="my-5 h-44">{description}</div>
            <div className="flex flex-row justify-between items-center space-x-5">
                <Button type="white" className="w-20">
                    <a href={link} target="_blank" rel="noopener noreferrer">
                        Apply
                    </a>
                </Button>
            </div>
        </Card>
    );
};

export default Jobs;

Job.propTypes = {
    htmlId: propTypes.string,
    title: propTypes.string,
    description: propTypes.string,
    company: propTypes.string,
    imageUrl: propTypes.string,
    link: propTypes.string,
    location: propTypes.string,
};
