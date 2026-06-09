import { Marquee } from '@/components/ui/marquee';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import ReviewCardDetailModal from './ReviewCardDetailModal';
import { Review } from '@/types';
import { reviewService } from '@/services/api';

interface ReviewCardProps {
    reviews: Review;
}



const ReviewCard = ({ review, onClick }: { review: Review; onClick: () => void }) => {
    const { authorAvatar, authorName, authorEmail, body } = review;

    return (
        <figure
            onClick={onClick}
            className={cn(
                "mb-8",
                "relative h-auto w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]"
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={authorAvatar || "/default-avatar.png"} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium text-black">
                        {authorName}
                    </figcaption>
                    <p className="text-xs font-medium text-black">{authorEmail}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm text-black">{body}</blockquote>
        </figure>
    );
};

export const Reviews3D = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [selectedReview, setSelectedReview] = useState<Review | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                // Вызываем метод сервиса
                const data = await reviewService.getAll();
                const filteredData = data.filter(review => review.parentId === null || review.parentId === undefined);
                // Сохраняем полученные данные в state
                setReviews(filteredData);
            } catch (error) {
                console.error("Ошибка при загрузке отзывов:", error);
            } finally {
                console.log(reviews)
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);
    

    const firstRow = reviews.slice(0, reviews.length / 2);
    const secondRow = reviews.slice(reviews.length / 2);
    const thirdRow = reviews.slice(0, 2);

    return (
        <section className="py-24 px-6 bg-slate-50 ">
            {/* 1. Добавили relative и z-10, чтобы заголовок всегда был поверх */}
            <div className="max-w-7xl mx-auto px-4 mb-8 relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-center text-smartfix-darkest mb-16">
                    Отзывы наших клиентов
                </h2>
            </div>

            {/* 2. Перенесли overflow-hidden сюда и добавили perspective:300px */}
            <div className="relative flex h-[600px] w-full flex-row items-center justify-center gap-4 overflow-hidden [perspective:300px]">

                {/* 3. Использовали точный transform из оригинального кода */}
                <div
                    className="flex flex-row items-center gap-4"
                    style={{
                        transform:
                            "translateX(-100px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
                    }}
                >
                    {/* Колонки остаются без изменений */}
                    <Marquee pauseOnHover vertical className="[--duration:25s]">
                        {firstRow.map((rev) => (
                            <ReviewCard
                                key={rev.id}
                                review={rev}
                                onClick={() => setSelectedReview(rev)}
                            />
                        ))}
                    </Marquee>

                    <Marquee reverse pauseOnHover vertical className="[--duration:30s]">
                        {secondRow.map((rev) => (
                            <ReviewCard
                                key={rev.id}
                                review={rev}
                                onClick={() => setSelectedReview(rev)}
                            />
                        ))}
                    </Marquee>

                    <Marquee pauseOnHover vertical className="[--duration:25s]">
                        {thirdRow.map((rev, i) => (
                            <ReviewCard
                                key={rev.id}
                                review={rev}
                                onClick={() => setSelectedReview(rev)}
                            />
                        ))}
                    </Marquee>
                </div>

                {/* 4. Градиенты теперь обязательно должны исчезать в transparent */}
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-slate-50 to-transparent"></div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-slate-50 to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-slate-50 to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-slate-50 to-transparent"></div>
            </div>
            {selectedReview && (
                <ReviewCardDetailModal
                    review={selectedReview}
                    onClose={() => setSelectedReview(null)}
                />
            )}
        </section>
    );
};

export default Reviews3D;